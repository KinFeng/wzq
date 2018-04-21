const rowWinSize = 5;
const numDots = 15;
const totalDots = numDots * numDots;
const boxWidth = 30;
const gridWidth = (numDots - 1) * boxWidth;
const gridPadding = 10;
const boardWidth = gridWidth + gridPadding * 2;
const chessWidth = 16;

const ColorEnum = {
  white: 'white',
  black: 'black',
};
const Messages = {
  white: '白子',
  black: '黑子',
};
const Directions = [
  { x: -1, y: 0, name: 'left' },
  { x: -1, y: -1, name: 'topLeft' },
  { x: 0, y: -1, name: 'top' },
  { x: -1, y: 1, name: 'topRight' },
];


export default {
  rowWinSize,
  numDots,
  totalDots,
  boxWidth,
  chessWidth,
  gridWidth,
  gridPadding,
  boardWidth,
  ColorEnum,
  Messages,
  Directions,
};
