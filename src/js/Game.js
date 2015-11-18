import React from "react";
import ReactDom from "react-dom";

let Game = React.createClass({
  getInitialState: function() {
    return {
      field: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    }
  },

  onHitCell: function(e) {
    console.log("FUCK");
  },

  render: function() {
    let field = this.state.field;

    return (
      <div className="ttt-game">
        <div className="ttt-field">
          {field.map((row, y) =>
            <div className="ttt-row" key={`row_${y}`}>
              {row.map((cell, x) =>
                <div className="ttt-cell" onClick={this.onHitCell} key={`cell_y=${y}_x=${x}`}></div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
});

export default Game;
