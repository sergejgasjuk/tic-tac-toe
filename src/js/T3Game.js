import React from "react";
import classNames from "classnames/bind";

let css = {
  game      : "t3-game",
  panel     : "t3-panel",
  panelX    : "t3-panel--active-x",
  panelO    : "t3-panel--active-o",
  panelItem : "t3-panel-item",
  field     : "t3-field",
  fieldX    : "t3-field--active-x",
  fieldO    : "t3-field--active-o",
  row       : "t3-row",
  cell      : "t3-cell",
  cellX     : "t3-cell--x",
  cellO     : "t3-cell--o",
  cellXWin  : "t3-cell--x_winner",
  cellOWin  : "t3-cell--o_winner",
  potentialX: "t3-cell--potential-x",
  potentialO: "t3-cell--potential-o",
  text      : "t3-text",
  textBold  : "t3-text--bold",
  textSmall : "t3-text--small"
};
let cx = classNames.bind(css);

const CELL_X = 1;
const CELL_O = -1;

let T3Game = React.createClass({
  getInitialState: function() {
    return {
      field: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      activeSign: this.setRandomSign(),
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
      isWinGame = !isWinGame;

      this.setState({isWinGame, winRow});
    } else if (draw) {
      console.log("is draw");
      isDrawGame = !isDrawGame;
      this.setState({isDrawGame});
    }

    isActiveGame = !isActiveGame;
    this.setState({isActiveGame});
  },

  checkWin: function() {
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

    return row ? {row} : false;
  },

  setRandomSign: function() {
    return Math.floor(Math.random() * 2) === CELL_X ? CELL_X : CELL_O;
  },

  checkEmptyCells: function() {
    let {field} = this.state;

    return field[0].some((el) => el === 0) || field[1].some((el) => el === 0) || field[2].some((el) => el === 0);
  },

  resetGame: function() {
    let {field, activeSign, isActiveGame, isDrawGame, isWinGame, winRow} = this.state;

    field.forEach((row, y) => {
      row.forEach((cell, x) => {
        field[y][x] = 0;
      });
    });

    activeSign = this.setRandomSign();
    isActiveGame = true;
    isWinGame = isDrawGame = false;

    this.setState({field, activeSign, isActiveGame, isDrawGame, isWinGame, winRow});
  },

  render: function() {
    let {field, isActiveGame, isWinGame, isDrawGame, activeSign} = this.state;
    let fieldClassName = cx(
      'field',
      {
        fieldX: activeSign === CELL_X && isActiveGame,
        fieldO: activeSign === CELL_O && isActiveGame
      }
    );

    return (
      <div className={cx('game')}>
        <div className={fieldClassName}>
          {field.map((row, y) =>
            <div className={cx('row')} key={`r_${y}`}>
              {row.map((cell, x) =>
                <T3Cell
                  onHit={this.onHitCell}
                  cellVal={cell}
                  posY={y}
                  posX={x}
                  isActiveGame={isActiveGame}
                  activeSign={activeSign}
                  isOccupied={field[y][x] !== 0}
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
    let {cellVal, isOccupied, activeSign, isActiveGame} = this.props;
    let isPotential = isActiveGame && !isOccupied;

    let className = cx(
      'cell',
      {
        cellX: cellVal === CELL_X,
        cellO: cellVal === CELL_O,
        potentialX: isPotential && activeSign === CELL_X,
        potentialO: isPotential && activeSign === CELL_O
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
    let {activeSign, isActiveGame, isWinGame, isDrawGame} = this.props;
    let gameOn = isActiveGame && !(isWinGame || isDrawGame);
    let gameOff = !isActiveGame && (isWinGame || isDrawGame);
    let winSign = activeSign === CELL_X ? CELL_O : CELL_X;
    let activeSignConverted = activeSign === CELL_X ? "X" : "O";
    let winSignConverted = winSign === CELL_X ? "X" : "O";
    let panelClassName = cx(
      'panel',
      {
        panelX: activeSign === CELL_X && isActiveGame,
        panelO: activeSign === CELL_O && isActiveGame
      }
    );

    return (
      <div
        className={panelClassName}
        onClick={gameOff ? this.props.onReset : null}>
        {gameOn &&
          <div className={cx('panelItem')}>
            <span className={cx('text')}> Player: </span>
            <b className={cx('text', 'textBold')}> {activeSignConverted} </b>
          </div>
        }
        {gameOff &&
          <div>
            {isDrawGame &&
              <div className={cx('panelItem')}>
                <span className={cx('text')}> It's </span>
                <b className={cx('text', 'textBold')}> Draw! </b>
              </div>
            }
            {isWinGame &&
              <div className={cx('panelItem')}>
                <span className={cx('text')}> Winner: </span>
                <b className={cx('text', 'textBold')}> {winSignConverted} </b>
              </div>
            }
            <small className={cx('text', 'textSmall')}> Click to start again! </small>
          </div>
        }
      </div>
    )
  }
});

export default T3Game;
