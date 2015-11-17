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

  render: function() {
    let field = this.state.field;

    return (
      <div className="ttt-game">
        {field.map((row, y) =>
          <div className="ttt-field-row">fuck</div>
        )}
      </div>
    )
  }
});

export default Game;
