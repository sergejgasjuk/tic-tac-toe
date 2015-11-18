import React from "react";
import ReactDom from "react-dom";
import classNames from "classnames";

const CELL_X = 1;
const CELL_O = -1;
let css = {
  "game"  : "t3-game",
  "field" : "t3-field",
  "row"   : "t3-row",
  "cell"  : "t3-cell",
  "cell-x": "t3-cell--x",
  "cell-o": "te-cell--o"
};

let Game = React.createClass({
  getInitialState: function() {
    return {
      field: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      currentSign: CELL_X
    }
  },

  onHitCell: function(e) {
    let isX = e.target.classList.contains("t3-cell--x");
    let isO = e.target.classList.contains("t3-cell--o");

    if (isX || isO) {
      return false;
    }

    console.log("cell hit");

    let coordX = e.target.dataset.x;
    let coordY = e.target.dataset.y;
    let {currentSign} = this.state;

    this._updateCell(coordY, coordX, currentSign);
    currentSign = currentSign === CELL_X ? CELL_O : CELL_X;
    this.setState({
      currentSign
    })
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

  render: function() {
    let field = this.state.field;

    return (
      <div className={css.game}>
        <div className={css.field}>
          {field.map((row, y) =>
            <div className={css.row} key={`row_${y}`}>
              {row.map((cell, x) =>
                <div className={
                      classNames({
                      "t3-cell" : true,
                      "t3-cell--x" : cell === 1,
                      "t3-cell--o" : cell === -1
                      })}
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
