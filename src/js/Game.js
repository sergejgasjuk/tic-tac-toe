import React from "react";
import ReactDom from "react-dom";
import classNames from "classnames/bind";

const CELL_X = 1;
const CELL_O = -1;
const CELL_X_WIN = CELL_X * 3;
const CELL_O_WIN = CELL_O * 3;
let css = {
  game  : "t3-game",
  field : "t3-field",
  row   : "t3-row",
  cell  : "t3-cell",
  cellX : "t3-cell--x",
  cellO : "t3-cell--o"
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
      winner: null
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
    let {currentSign} = this.state;

    this._updateCell(coordY, coordX, currentSign);

    currentSign = currentSign === CELL_X ? CELL_O : CELL_X;
    this.setState({
      currentSign
    });

    this.checkGameStatus();
    //this._calculatePoints();
  },

  checkGameStatus: function() {
    let {winner, gameStarted} = this.state;

    let w = this._calculatePoints();

    if (w) {
      if (w.result === CELL_X) {
        winner = CELL_X;
      } else {
        winner = CELL_O;
      }

      gameStarted = false;

      this.setState({winner, gameStarted});
    }

    // set draw
    // stop game
  },

  _updateCell(y, x, val) {
    let {field} = this.state;

    field.forEach((row) => {
      row.forEach((cell) => {
        field[y][x] = val;
      });
    });

    this.setState({
      field
    });
  },

  _calculatePoints: function() {
    let {field} = this.state;
    let n = 0;
    let rows = [
      field[0],
      [field[0][0], field[1][0], field[2][0]],
      field[1],
      [field[0][1], field[1][1], field[2][1]],
      field[2],
      [field[0][2], field[1][2], field[2][2]],
      [field[0][0], field[1][1], field[2][2]],
      [field[0][2], field[1][1], field[2][0]]
    ];

    while (n < rows.length) {
      let result = rows[n].reduce((i, j) => i + j);

      if ((result / 3) === CELL_X || (result / 3) === CELL_O) {
        return {result: result, row: rows[n]};
      }

      n += 1;
    }
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
                        cellX: cell === CELL_X,
                        cellO: cell === CELL_O
                      }
                    )}
                    onClick={this.onHitCell}
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
