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
  panelX: "t3-panel--active-x",
  panelO: "t3-panel--active-o",
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

  checkEmptyCells() {
    let {field} = this.state;

    return field[0].some((el) => el === 0) || field[1].some((el) => el === 0) || field[2].some((el) => el === 0);
  },

  resetGame: function() {
    let {field, activeSign, isActiveGame, isDrawGame, isWinGame, winRow, winSign} = this.state;

    field.forEach((row, y) => {
      row.forEach((cell, x) => {
        field[y][x] = 0;
      });
    });

    activeSign = CELL_X;
    isActiveGame = true;
    isWinGame = isDrawGame = false;
    winRow = winSign = null;

    this.setState({field, activeSign, isActiveGame, isDrawGame, isWinGame, winRow, winSign});
  },

  render: function() {
    let {field, isActiveGame, isWinGame, isDrawGame, winSign} = this.state;
    let activeSign = this.state.activeSign === CELL_X ? "X" : "O";
    winSign = winSign === CELL_X ? "X" : "O";

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
          isActiveGame={isActiveGame}
          isWinGame={isWinGame}
          isDrawGame={isDrawGame}
          winSign={winSign}
          activeSign={activeSign}/>
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
    let {activeSign, winSign, isActiveGame, isWinGame, isDrawGame} = this.props;
    let gameOn = isActiveGame && !(isWinGame || isDrawGame);
    let gameOff = !isActiveGame && (isWinGame || isDrawGame);

    return (
      <div
        className={cx(
          'panel',
          {
            panelX: activeSign === "X" && isActiveGame,
            panelO: activeSign === "O" && isActiveGame
          }
        )}
        onClick={gameOff ? this.props.onReset : null}>
        {gameOn &&
          <div>Player: <b>{activeSign}</b></div>
        }
        {gameOff &&
          <div>
            {isDrawGame &&
              <div>It's <b>Draw!</b></div>
            }
            {isWinGame &&
              <div>Winner: <b>{winSign}</b></div>
            }
            <small>Click to start again!</small>
          </div>
        }
      </div>
    )
  }
});

export default T3Game;
