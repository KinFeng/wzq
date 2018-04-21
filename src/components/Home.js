import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import ChessPanel from './ChessPanel';
import ChessCanvas from './ChessCanvas';

import _random from 'lodash/random';
import _extend from 'lodash/extend';
import setting from './setting';

const {
  rowWinSize,
  totalDots,
  boxWidth,
  coordFix,
  ColorEnum,
  Messages,
  Directions,
} = setting;

const newChess = params => ({ left: -999, top: -999, color: ColorEnum.white, done: false, ...params });

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

class Home extends Component {
  state = getDefaultState();
  reset = () => {
    const { selected } = this.state;
    this.setState(getDefaultState());
    this.setState({ selected });
  }
  undo = () => {
    const { chessIndex, prevChess, chesses, chessTable } = this.state;

    if (chessIndex === 0) {
      return;
    }

    // 从chessTable中删除
    const { dotX, dotY } = prevChess;
    delete chessTable[`${dotX}_${dotY}`];

    // 从chesses中删除
    chesses.length -= 1;

    const index = chessIndex - 1;
    const color = this.getColor(index);
    const chess = newChess({ index, color });

    const oldPrevChess = chesses[chesses.length - 1];
    this.setState({ currentChess: chess, chessIndex: index, prevChess: oldPrevChess, finished: false });
  }
  down = ({ nativeEvent }) => {
    if (this.state.finished) {
      return;
    }

    const { chessIndex, currentChess, colors, chesses, chessTable } = this.state;
    const pos = this.calcCoord(nativeEvent);

    if (!this.isValidDot(pos)) {
      return;
    }

    // 确认下棋位置
    _extend(currentChess, pos, { done: true });
    chesses.push(currentChess);

    this.checkWinning();

    const nextIndex = chessIndex + 1;
    const nextColor = colors[nextIndex & 1];
    const nextChess = newChess({ color: nextColor });

    // 保存到chessTable
    const { dotX, dotY } = currentChess;
    chessTable[`${dotX}_${dotY}`] = currentChess;

    const prevChess = currentChess;
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
  getCurrentColor = () => this.getColor(this.state.chessIndex)
  getColor = (index) => (this.state.colors[index & 1])
  isValidDot = ({ left, top }) => {
    const { currentChess, chesses } = this.state;
    return !chesses.some(chessItem =>
      currentChess !== chessItem && (chessItem.left === left && chessItem.top === top));
  }
  checkWinning = () => {
    const { currentChess, chesses } = this.state;

    // 数量未达到，不需要检查
    if (chesses.length / 2 < rowWinSize) {
      return false;
    }

    const chess = currentChess;
    for (const direction of Directions) {
      const row = [currentChess];
      // 从后方检查
      this.countUpChess({ direction, row, chess });
      // 从前方检查
      this.countDownChess({ direction, row, chess });

      const isWin = row.length >= rowWinSize;
      if (isWin) {
        alert(`${Messages[chess.color]}胜出`);
        this.setState({ finished: true });
        return true;
      }
    }

    // 检查结束
    if (chesses.length >= totalDots) {
      alert('游戏结束，和局');
      this.setState({ finished: true });
      return true;
    }

    return false;
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
  getChessByDot = ({ dotX, dotY }) => {
    return this.state.chessTable[`${dotX}_${dotY}`];
  }
  calcCoord = ({ clientX, clientY }) => {
    const { offsetLeft, offsetTop } = this.chessBoard;
    const x1 = clientX - (clientX % boxWidth);
    const y1 = clientY - (clientY % boxWidth);
    const left = x1 + coordFix - offsetLeft;
    const top = y1 - offsetTop;
    const dotX = x1 / boxWidth;
    const dotY = y1 / boxWidth;
    return { left, top, dotX, dotY };
  }
  switch = (i) => {
    this.setState({selected: i});
  }
  render() {
    const { classes } = this.props;
    const { selected, currentChess, finished } = this.state;
    return (
      <div className={classes.root}>
        <div
           className="board-wrap"
           onMouseDown={this.down}
           onMouseMove={this.move}
           ref={node => {this.chessBoard = node}}
        >
        { selected === 0 ?
          <ChessPanel { ...this.state } />
          :
          <ChessCanvas { ...this.state } /> }
        </div>
        <div className="bottom-bar">
          <Button variant="raised" className={classes.button} disabled={selected === 0} onTouchTap={() => { this.switch(0); }}>使用Dom</Button>
          <Button variant="raised" className={classes.button} disabled={selected === 1} onTouchTap={() => { this.switch(1); }}>使用Canvas</Button>
          <br />
          <Button variant="raised" color="primary" className={classes.button} onTouchTap={() => { this.undo(); }}>悔棋</Button>
          <Button variant="raised" className={classes.button} onTouchTap={() => { this.reset(); }}>重新开始</Button>

          <div style={{marginLeft: 20, display: 'inline-block'}}> 
            { finished === true ? 
              <span>本局结束</span>
              :
              <span>当前玩家: {Messages[currentChess.color]}</span>
            }
          </div>
          <div />
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
