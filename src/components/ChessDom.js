
import React from 'react';
import classnames from 'classnames';

const ChessPanel = ({ chesses, currentChess }) => {
  const allChesses = [...chesses, currentChess];

  return (
    <div className="chess-board">
      <div className="bg-grid">
        {allChesses.map(({ left, top, color, done }) =>
          <span className={classnames('chess', color, { pending: !done })} style={{ left, top }} />,
        )}
      </div>
    </div>);
};

export default ChessPanel;
