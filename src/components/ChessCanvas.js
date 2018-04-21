
import React, { Component } from 'react';
import setting from './setting';

const {
  numDots,
  boxWidth,
  chessWidth,
  gridPadding,
  gridWidth,
} = setting;

const chessRadius = chessWidth / 2 + 1;
const PI2 = Math.PI * 2;

class ChessCanvas extends Component {
  componentDidMount() {
    const canvas = this.canvas;
    this.context = canvas.getContext('2d');
    this.context.translate(0.5, 0.5);
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
    this.context.clearRect(-0.5, -0.5, this.canvas.width, this.canvas.height);
  }
  drawGrid = () => {
    const context = this.context;
    context.save();
    context.lineWidth = 1;
    context.strokeStyle = '#000';
    for (let i = 0; i < numDots; i += 1) {
      const y = boxWidth * i + gridPadding;
      context.beginPath();
      context.moveTo(gridPadding, y);
      context.lineTo(gridPadding + gridWidth, y);
      context.stroke();

      const x = boxWidth * i + gridPadding;
      context.beginPath();
      context.moveTo(x, gridPadding);
      context.lineTo(x, gridPadding + gridWidth);
      context.stroke();
    }

    context.restore();
  }
  drawChesses = () => {
    const { chesses, currentChess } = this.props;
    const allChesses = [...chesses, currentChess];

    const context = this.context;
    context.save();

    const colorsMap = {
      white: '#eee',
      whiteAlpha: 'rgba(255,255,255,0.5)',
      black: '#111',
      blackAlpha: 'rgba(0,0,0,0.5)',
    };

    allChesses.map(({ left, top, color, done }) => {
      context.fillStyle = colorsMap[`${color}${done ? '' : 'Alpha'}`];
      context.strokeStyle = color;
      context.beginPath();
      context.arc(left + chessRadius, top + chessRadius, chessRadius, 0, PI2, false);
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
