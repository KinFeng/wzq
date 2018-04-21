
import React, { Component } from 'react';
import setting from './setting';

const {
  numDots,
  boxWidth,
  boardWidth,
  chessWidth,
  gridPadding,
} = setting;

const chessRadius = chessWidth / 2;
const PI2 = Math.PI * 2;

class ChessCanvas extends Component {
  componentDidMount() {
    const canvas = this.canvas;
    this.context = canvas.getContext('2d');
    this.renderCanvas();
  }
  shouldComponentUpdate() {
    this.renderCanvas();

    // 不执行render方法
    return false;
  }
  renderCanvas = () => {
    this.clear();
    this.drawGrid();
    this.drawChesses();
  }
  clear = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawGrid = () => {
    const context = this.context;
    context.save();
    context.lineWidth = 1;
    context.strokeStyle = '#000';
    for (let i = 0; i < numDots; i += 1) {
      const y = (boxWidth + 0.5) * i + gridPadding;
      context.beginPath();
      context.moveTo(gridPadding + 0.5, y);
      context.lineTo(boardWidth, y);
      context.stroke();

      const x = (boxWidth + 0.5) * i + gridPadding;
      context.beginPath();
      context.moveTo(x, gridPadding + 0.5);
      context.lineTo(x, boardWidth);
      context.stroke();
    }

    context.restore();
  }
  drawChesses = () => {
    const { chesses, currentChess } = this.props;
    const allChesses = [...chesses, currentChess];

    const context = this.context;
    context.save();

    const whiteColor = context.createRadialGradient(75, 50, 5, 90, 60, 100);
    whiteColor.addColorStop(0, '#ffffff');
    whiteColor.addColorStop(1, '#eeeeee');

    const blackColor = context.createRadialGradient(75, 50, 5, 90, 60, 100);
    blackColor.addColorStop(0, '#ffffff');
    blackColor.addColorStop(1, '#000000');

    const whiteColor2 = context.createRadialGradient(75, 50, 5, 90, 60, 100);
    whiteColor2.addColorStop(0, 'rgba(255,255,255,0.5)');
    whiteColor2.addColorStop(1, 'rgba(238,238,238,0.5)');

    const blackColor2 = context.createRadialGradient(75, 50, 5, 90, 60, 100);
    blackColor2.addColorStop(0, 'rgba(255,255,255,0.5)');
    blackColor2.addColorStop(1, 'rgba(0,0,0,0.5)');

    const colorsMap = {
      white: whiteColor,
      white2: whiteColor2,
      black: blackColor,
      black2: blackColor2,
    };

    allChesses.map(({ left, top, color, done }) => {
      context.fillStyle = colorsMap[color];
      context.beginPath();
      context.arc(left, top, chessRadius, 0, PI2, false);
      context.stroke();
      context.fill();
    });

    context.restore();
  }
  render() {
    return (<canvas className="board-canvas" ref={node => { this.canvas = node; }} width="442" height="442" />);
  }
}

export default ChessCanvas;
