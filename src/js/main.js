import React from "react";
import ReactDom from "react-dom";

var Box = React.createClass({
  render: function() {
    return (
      <div>fuckfuck</div>
    )
  }
});

ReactDom.render(<Box/>, document.getElementById("container"));
