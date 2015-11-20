import React from "react";
import ReactDom from "react-dom";
import classNames from "classnames/bind";

const CELL_X = 1;
const CELL_O = -1;
const CELL_X_WIN = 10;
const CELL_O_WIN = -10;
let css = {
  game  : "t3-game",
  panel : "t3-panel",
  field : "t3-field",
  row   : "t3-row",
  cell  : "t3-cell",
  cellOccupied: "t3-cell--occupied",
  cellX : "t3-cell--x",
  cellO : "t3-cell--o",
  cellXWin: "t3-cell--x_winner",
  cellOWin: "t3-cell--o_winner",
  cellXHover: "t3-cell--hover-x",
  cellOHover: "t3-cell--hover-o"
};
let cx = classNames.bind(css);

let T3Game = React.createClass({
  getInitialState: function() {
    return {
      field: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      winCombos: [
        [{y: 0, x: 0}, {y: 0, x: 1}, {y: 0, x: 2}],
        [{y: 0, x: 0}, {y: 1, x: 0}, {y: 2, x: 0}],
        [{y: 1, x: 0}, {y: 1, x: 1}, {y: 1, x: 2}],
        [{y: 0, x: 1}, {y: 1, x: 1}, {y: 2, x: 1}],
        [{y: 2, x: 0}, {y: 2, x: 1}, {y: 2, x: 2}],
        [{y: 0, x: 2}, {y: 1, x: 2}, {y: 2, x: 2}],
        [{y: 0, x: 0}, {y: 1, x: 1}, {y: 2, x: 2}],
        [{y: 0, x: 2}, {y: 1, x: 1}, {y: 2, x: 0}]
      ],
      activeSign: CELL_X,
      isActiveGame: true,
      isDrawGame: false,
      isWinGame: false
    }
  },

  onHitCell: function(y, x) {
    let {field, activeSign, isActiveGame} = this.state;

    if (field[y][x] !== 0 || !isActiveGame) {
      return false;
    }

    field[y][x] = activeSign;
    activeSign = activeSign === CELL_X ? CELL_O : CELL_X;

    this.setState({field, activeSign});
    this.updateGame();
  },

  updateGame: function() {
    let win, draw;
    let {isActiveGame, isDrawGame, isWinGame} = this.state;

    win = this.checkWin();
    draw = !win && !this.checkEmptyCells();

    if (!win && !draw) {
      return false;
    }

    if (win) {
      console.log("is win");
      let winRow = win.row;
      let winSign = win.sign;
      isWinGame = !isWinGame;

      this.setState({isWinGame, winRow, winSign});
    } else if (draw) {
      console.log("is draw");
      isDrawGame = !isDrawGame;
      this.setState({isDrawGame});
    }

    isActiveGame = !isActiveGame;
    this.setState({isActiveGame});
  },

  checkWin() {
    let {field} = this.state;
    let winCombos = [
      [{y: 0, x: 0}, {y: 0, x: 1}, {y: 0, x: 2}],
      [{y: 0, x: 0}, {y: 1, x: 0}, {y: 2, x: 0}],
      [{y: 1, x: 0}, {y: 1, x: 1}, {y: 1, x: 2}],
      [{y: 0, x: 1}, {y: 1, x: 1}, {y: 2, x: 1}],
      [{y: 2, x: 0}, {y: 2, x: 1}, {y: 2, x: 2}],
      [{y: 0, x: 2}, {y: 1, x: 2}, {y: 2, x: 2}],
      [{y: 0, x: 0}, {y: 1, x: 1}, {y: 2, x: 2}],
      [{y: 0, x: 2}, {y: 1, x: 1}, {y: 2, x: 0}]
    ];
    let sign, row;

    let n = 0;
    while (n < winCombos.length) {
      let pointsInRow = winCombos[n].reduce((prev, curr) => prev + field[curr.y][curr.x], 0);
      let result = pointsInRow / 3;

      if (result === CELL_X || result === CELL_O) {
        sign = result;
        row = winCombos[n];
        break;
      }

      n += 1;
    }

    return sign && row ? {sign, row} : false;
  },

  //TODO fix bug
  checkEmptyCells() {
    let hasEmptyCells = false;
    let {field} = this.state;

    field.forEach((row) => {
      hasEmptyCells = row.some((el) => el === 0)
    });

    return hasEmptyCells;
  },

  resetGame: function() {
    let {field, activeSign, isActiveGame} = this.state;

    field.forEach((row, y) => {
      row.forEach((cell, x) => {
        field[y][x] = 0;
      });
    });

    activeSign = CELL_X;
    isActiveGame = true;

    this.setState({field, activeSign, isActiveGame});
  },

  render: function() {
    let field = this.state.field;
    let sign = this.state.activeSign === CELL_X ? "X" : "O";
    let isActiveGame = this.state.isActiveGame;

    return (
      <div className={cx('game')}>
        <div className={cx('field')}>
          {field.map((row, y) =>
            <div className={cx('row')} key={`r_${y}`}>
              {row.map((cell, x) =>
                <T3Cell
                  onHit={this.onHitCell}
                  cellVal={cell}
                  posY={y}
                  posX={x}
                  isActiveGame={isActiveGame}
                  key={`c_y=${y}_x=${x}`}/>
              )}
            </div>
          )}
        </div>
        <T3Panel
          onReset={this.resetGame}
          sign={sign}/>
      </div>
    )
  }
});

let T3Cell = React.createClass({
  onHit: function(){
    let coordY = this.props.posY;
    let coordX = this.props.posX;

    this.props.onHit(coordY, coordX);
  },

  render: function() {
    let cellVal = this.props.cellVal;
    let className = cx(
      'cell',
      {
        cellX: cellVal === CELL_X,
        cellO: cellVal === CELL_O
      }
    );
    return (
      <div
        className={className}
        onClick={this.onHit}></div>
    )
  }
});

let T3Panel = React.createClass({
  render: function() {
    let activeSign = this.props.sign;

    return (
      <div
        className={cx('panel')}
        onClick={this.props.onReset}
        > Current: {activeSign}
      </div>
    )
  }
});

export default T3Game;
