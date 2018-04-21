
import React, { Component } from 'react';
import classnames from 'classnames';
import _random from 'lodash/random';
import _extend from 'lodash/extend';

const rowWinSize = 5;
const numDots = 15;
const totalDots = numDots * numDots;
const numBoxes = numDots - 1;
const boxWidth = 30;
const chessWidth = 16;
const gridOffset = 10 + 8;
const coordFix = -1 * (gridOffset + chessWidth / 2 + 4);
const ColorEnum = {
  white: 'white',
  black: 'black',
};
export const Messages = {
  white: '白子',
  black: '黑子',
};
const Directions = [
  { x: -1, y: 0, name: 'left' },
  { x: -1, y: -1, name: 'topLeft' },
  { x: 0, y: -1, name: 'top' },
  { x: -1, y: 1, name: 'topRight' },
];

const newChess = params => ({ left: -999, top: -999, color: ColorEnum.white, done: false, ...params });

const getDefaultState = () => {
  const ranNum = _random(0, 1);
  const array = [[ColorEnum.white, ColorEnum.black], [ColorEnum.black, ColorEnum.white]];
  const colors = array[ranNum];
  const color = colors[0];
  const currentChess = newChess({ index: 0, color });
  const state = {
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

class ChessPanel extends Component {
  state = getDefaultState();
  componentDidMount() {

  }
  reset = () => {
    this.setState(getDefaultState());
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
    const x1 = clientX - (clientX % boxWidth);
    const y1 = clientY - (clientY % boxWidth);
    const left = x1 + coordFix;
    const top = y1 + coordFix;
    const dotX = x1 / boxWidth;
    const dotY = y1 / boxWidth;
    return { left, top, dotX, dotY };
  }
  render() {
    const { chesses, currentChess } = this.state;
    const allChesses = [...chesses, currentChess];
    const array = [];
    array.length = 14;
    array.fill(0);
    return (
      <div
        className="board"
        onMouseDown={this.down}
        onMouseMove={this.move}
      >
        <div className="bg-grid">
          {/* {array.map((e,i)=><div className={classnames('square', { even: i & 1 })} />)} */}
          {allChesses.map(({ left, top, color, done }) =>
            <span className={classnames('chess', color, { pending: !done })} style={{ left, top }} />,
          )}
        </div>
      </div>);
  }
}


export default ChessPanel;
