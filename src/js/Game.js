import React from "react";
import ReactDom from "react-dom";

const CELL_X = 1;
const CELL_O = -1;

let Game = React.createClass({
  getInitialState: function() {
    return {
      field: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      playerSign: CELL_X
    }
  },

  onHitCell: function(e) {
    if (e.target.classList.contains("ttt-cell--x")) {
      console.log("ocupied");
      return false;
    }

    let coordX = e.target.dataset.x;
    let coordY = e.target.dataset.y;

    this._updateCell(coordY, coordX);
  },

  _updateCell(y, x) {
    let {field, playerSign} = this.state;

    field.forEach((row) => {
      row.forEach((cell) => {
        field[y][x] = playerSign;
      });
    });

    this.setState({
      field
    });
  },

  render: function() {
    let field = this.state.field;
    let setCellClassName = (val) => {
      if (val === CELL_X) {
        return "ttt-cell--x";
      } else {
        return '';
      }
    };

    return (
      <div className="ttt-game">
        <h2>player figure: {this.state.playerSign === 1 ? "x" : "o"}</h2>
        <div className="ttt-field">
          {field.map((row, y) =>
            <div className="ttt-row" key={`row_${y}`}>
              {row.map((cell, x) =>
                <div className={`ttt-cell ` + setCellClassName(cell)}
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
