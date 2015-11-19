import React from "react";
import ReactDom from "react-dom";
import classNames from "classnames/bind";

const CELL_X = 1;
const CELL_O = -1;
const CELL_X_WIN = 10;
const CELL_O_WIN = -10;
let css = {
  game  : "t3-game",
  field : "t3-field",
  row   : "t3-row",
  cell  : "t3-cell",
  cellX : "t3-cell--x",
  cellO : "t3-cell--o",
  cellXWin: "t3-cell--x_winner",
  cellOWin: "t3-cell--o_winner",
  cellXHover: "t3-cell--hover-x",
  cellOHover: "t3-cell--hover-o"
};
let cx = classNames.bind(css);

let Game = React.createClass({
  getInitialState: function() {
    return {
      field: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      currentSign: CELL_X,
      gameStarted: true,
      winnerSign: null
    }
  },

  onHitCell: function(e) {
    let isOccupiedCell = e.target.dataset.occupied;

    if (isOccupiedCell) {
      //console.log("occupied");
      return false;
    }

    if (!this.state.gameStarted) {
      return false;
    }

    e.target.dataset.occupied = true;
    //console.log("cell hit");

    let coordX = e.target.dataset.x;
    let coordY = e.target.dataset.y;
    let {field, currentSign} = this.state;

    field.forEach((row) => {
      row.forEach((cell) => {
        field[coordY][coordX] = currentSign;
      });
    });

    currentSign = currentSign === CELL_X ? CELL_O : CELL_X;

    this.setState({
      field,
      currentSign
    });

    this.checkGameStatus();
  },

  onMouseOverCell: function(e) {
    if (e.target.dataset.occupied || !this.state.gameStarted) {
      return false;
    }

    let hoverClass = this.state.currentSign === CELL_X ? cx('cellXHover') : cx('cellOHover');

    e.target.classList.add(hoverClass);
  },

  onMouseOutCell: function(e) {
    //if (e.target.dataset.occupied) {
    //  return false;
    //}

    e.target.classList.remove(cx('cellXHover'), cx('cellOHover'));
  },

  checkGameStatus: function() {
    let {field, winnerSign, gameStarted} = this.state;
    let winCases = [
      [{y: 0, x: 0}, {y: 0, x: 1}, {y: 0, x: 2}],
      [{y: 0, x: 0}, {y: 1, x: 0}, {y: 2, x: 0}],
      [{y: 1, x: 0}, {y: 1, x: 1}, {y: 1, x: 2}],
      [{y: 0, x: 1}, {y: 1, x: 1}, {y: 2, x: 1}],
      [{y: 2, x: 0}, {y: 2, x: 1}, {y: 2, x: 2}],
      [{y: 0, x: 2}, {y: 1, x: 2}, {y: 2, x: 2}],
      [{y: 0, x: 0}, {y: 1, x: 1}, {y: 2, x: 2}],
      [{y: 0, x: 2}, {y: 1, x: 1}, {y: 2, x: 0}]
    ];
    let highLightRow = [];
    let n = 0;
    while (n < winCases.length) {
      let result = winCases[n].reduce((prev, curr) => prev + field[curr.y][curr.x], 0);

      if ((result / 3) === CELL_X || (result / 3) === CELL_O) {
        winnerSign = result / 3;
        highLightRow = winCases[n].slice(0);
        gameStarted = !gameStarted;
        break;
      }

      n += 1;
    }

    let f = winnerSign === CELL_X ? CELL_X_WIN : CELL_O_WIN;
    highLightRow.forEach((cell) => {
      field[cell.y][cell.x] = f
    });

    this.setState({field, winnerSign, gameStarted});
  },

  render: function() {
    let field = this.state.field;

    return (
      <div className={cx('game')}>
        <div className={cx('field')}>
          {field.map((row, y) =>
            <div className={cx('row')} key={`row_${y}`}>
              {row.map((cell, x) =>
                <div className={cx(
                      'cell',
                      {
                        cellX: cell === CELL_X || cell === +CELL_X_WIN,
                        cellO: cell === CELL_O || cell === CELL_O_WIN,
                        cellXWin: cell === +CELL_X_WIN,
                        cellOWin: cell === CELL_O_WIN
                      }
                    )}
                    onClick={this.onHitCell}
                    onMouseOver={this.onMouseOverCell}
                    onMouseOut={this.onMouseOutCell}
                    data-y={y}
                    data-x={x}
                    key={`cell_y=${y}_x=${x}`}>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
});

export default Game;
