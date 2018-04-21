import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import ChessDom from './ChessDom';
import ChessCanvas from './ChessCanvas';

import _random from 'lodash/random';
import _extend from 'lodash/extend';
import setting from './setting';

const {
  isMobile,
  rowWinSize,
  totalDots,
  boxWidth,
  ColorEnum,
  Messages,
  Directions,
} = setting;

const newChess = params => ({ left: -999, top: -999, color: ColorEnum.white, done: false, ...params });
const dotKey = ({ dotX, dotY })=>(`${dotX}_${dotY}`);

const getDefaultState = () => {
  const ranNum = _random(0, 1);
  const array = [[ColorEnum.white, ColorEnum.black], [ColorEnum.black, ColorEnum.white]];
  const colors = array[ranNum];
  const color = colors[0];
  const currentChess = newChess({ index: 0, color });
  const state = {
    selected: 0,
    finished: false,
    chessIndex: 0,
    firstColor: color,
    colors,
    chesses: [],
    redoChesses: [],
    chessTable: {},
    prevChess: null,
    currentChess,
  };
  return state;
};


const styles = theme => ({
  root: {
    flexGrow: 1,
    width: 442,
    margin: '0 auto',
  },
  button: {
    margin: theme.spacing.unit,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class ChessView extends Component {
  state = getDefaultState();
  reset = () => {
    const { selected } = this.state;
    this.setState(getDefaultState());
    this.setState({ selected }, ()=>{
      if(selected === 1 && this.chessCanvas !== undefined) {
        this.chessCanvas.reset();
      }
    });
  }
  undo = () => {
    const { chessIndex, prevChess, chesses, redoChesses, chessTable } = this.state;

    if (chessIndex === 0) {
        this.showMessage('没有棋步可以撤销了');
      return;
    }

    // 从chessTable中删除
    delete chessTable[dotKey(prevChess)];

    // 从chesses中删除
    const undoChess = chesses.pop();
    redoChesses.push(undoChess);

    const index = chessIndex - 1;
    const color = this.getColor(index);
    const chess = newChess({ index, color });

    const oldPrevChess = chesses[chesses.length - 1];
    this.setState({ currentChess: chess, chessIndex: index, prevChess: oldPrevChess, finished: false });
  }
  redo = () => {
    const { redoChesses } = this.state;

    if(redoChesses.length === 0) {
      this.showMessage('没有棋步可以恢复了');
      return;
    }

    const chess = redoChesses.pop();

    this.doChess(chess);
  }
  down = ({ nativeEvent }) => {
    if (this.state.finished) {
      this.showMessage('本局已结束，请重新开始')
      return;
    }

    const { currentChess, redoChesses } = this.state;
    const pos = this.calcCoord(nativeEvent);
    if (!this.isValidDot(pos)) {
      return;
    }

    // 确认下棋位置
    _extend(currentChess, pos, { done: true });
    
    this.doChess(currentChess);

    // 新的操作，清空原有redo记录
    redoChesses.length = 0;
  }
  doChess = (chess) => {
    const { chessIndex, chesses, colors, chessTable, redoChesses  } = this.state;

    if(chess.index !== chessIndex ) {
      console.log(chess, this.state);
      return;
    }

    chesses.push(chess);

    this.checkWinning(chess);

    const nextIndex = chessIndex + 1;
    const nextColor = colors[nextIndex & 1];
    const nextChess = newChess({ color: nextColor, index: nextIndex });

    // 保存到chessTable
    chessTable[dotKey(chess)] = chess;

    const prevChess = chess;
    this.setState({ prevChess, currentChess: nextChess, chessIndex: nextIndex });
  }
  move = ({ nativeEvent }) => {
    const { currentChess, finished } = this.state;
    if (finished) {
      return;
    }
    const { left, top } = this.calcCoord(nativeEvent);
    currentChess.left = left;
    currentChess.top = top;
    this.setState({ currentChess });
  }
  touchStart = (e) => {
    this.move(e);
  }
  touchMove = ({ nativeEvent:{changedTouches} }) => {
    const nativeEvent = { 
      clientX: parseInt(changedTouches[0].clientX) - 30,
      clientY: parseInt(changedTouches[0].clientY) - 30,
    };
    this.move({ nativeEvent });
  }
  touchEnd = ({ nativeEvent:{changedTouches} }) => {
    const nativeEvent = { 
      clientX: parseInt(changedTouches[0].clientX) - 30,
      clientY: parseInt(changedTouches[0].clientY) - 30,
    };
    
    this.down({ nativeEvent });
  } 
  getCurrentColor = () => this.getColor(this.state.chessIndex)
  getColor = (index) => (this.state.colors[index & 1])
  isValidDot = ({ left, top }) => {

    if(left < -3 || top < -3 ) {
      return false;
    }

    const { currentChess, chesses } = this.state;
    return !chesses.some(chessItem =>
      currentChess !== chessItem && (chessItem.left === left && chessItem.top === top));
  }
  checkWinning = (chess) => {
    const { chesses } = this.state;

    // 数量未达到，不需要检查
    if (chesses.length / 2 < rowWinSize - 1) {
      return false;
    }

    for (const direction of Directions) {
      const row = [chess];
      // 从后方检查
      this.countUpChess({ direction, row, chess });
      // 从前方检查
      this.countDownChess({ direction, row, chess });

      const isWin = row.length >= rowWinSize;
      if (isWin) {
        this.setState({ finished: true, winner: chess.color }, ()=>{
          this.showMessage(`${Messages[chess.color]}胜出`);
        });
        return true;
      }
    }

    // 检查结束
    if (chesses.length >= totalDots) {
      this.setState({ finished: true }, ()=>{
        this.showMessage('游戏结束，和局');
      });
      return true;
    }

    return false;
  }
  showMessage = (content) => {
    setTimeout(()=>{alert(content);}, 100);
  }
  countUpChess = ({ direction, direction: { x, y }, row, chess }) => {
    const dot = { dotX: chess.dotX + x, dotY: chess.dotY + y };
    const upChess = this.getChessByDot(dot);
    if (upChess !== undefined && upChess.color === chess.color) {
      row.push(upChess);
      this.countUpChess({ direction, row, chess: upChess });
    }
  }
  countDownChess = ({ direction, direction: { x, y }, row, chess }) => {
    const dot = { dotX: chess.dotX - x, dotY: chess.dotY - y };
    const downChess = this.getChessByDot(dot);
    if (downChess !== undefined && downChess.color === chess.color) {
      row.push(downChess);
      this.countDownChess({ direction, row, chess: downChess });
    }
  }
  getChessByDot = (dot) => {
    return this.state.chessTable[dotKey(dot)];
  }
  calcCoord = ({ clientX, clientY }) => {
    const { offsetLeft, offsetTop } = this.chessBoard;
    const x1 = clientX - (clientX % boxWidth);
    const y1 = clientY - (clientY % boxWidth);
    const fixX = isMobile ? 2 : 6;
    const fixY = isMobile ? 2 : 2;
    const left = x1 - offsetLeft + fixX;
    const top = y1 - offsetTop + fixY;
    const dotX = x1 / boxWidth;
    const dotY = y1 / boxWidth;
    return { left, top, dotX, dotY };
  }
  switch = (i) => {
    this.setState({selected: i});
  }
  render() {
    const { classes } = this.props;
    const { selected, currentChess, finished, winner } = this.state;
    return (
      <div className={classes.root}>
        <div>
          <Button variant="raised" className={classes.button} disabled={selected === 0} onTouchTap={() => { this.switch(0); }}>使用 Dom</Button>
          <Button variant="raised" className={classes.button} disabled={selected === 1} onTouchTap={() => { this.switch(1); }}>使用 Canvas</Button>
        
          <div style={{marginLeft: 20, display: 'inline-block'}}> 
            { finished === true ? 
              <span>本局结束, {Messages[winner]}胜出</span>
              :
              <span>当前玩家: {Messages[currentChess.color]} 
                <span className={classnames('chess-sample', currentChess.color)} />
              </span>
            }
          </div>
        </div>
        <div
           className="board-wrap"
           onMouseDown={!isMobile && this.down}
           onMouseMove={!isMobile && this.move}
           onTouchStart={this.touchStart}
           onTouchMove={this.touchMove}
           onTouchEnd={this.touchEnd}
           ref={node => {this.chessBoard = node}}
        >
        { selected === 0 ?
          <ChessDom { ...this.state } />
          :
          <ChessCanvas ref={node => { this.chessCanvas = node; }} { ...this.state } /> }
        </div>
        <div className="bottom-bar">
          <Button variant="raised" color="secondary" className={classes.button} onTouchTap={() => { this.reset(); }}>重新开始</Button>
          <Button variant="raised" color="primary" className={classes.button} onTouchTap={() => { this.undo(); }}>悔棋</Button>
          <Button variant="raised" color="primary" className={classes.button} onTouchTap={() => { this.redo(); }}>撤销悔棋</Button>
          <div />
        </div>
      </div>
    );
  }
}

ChessView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChessView);
