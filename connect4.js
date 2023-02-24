"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

//const WIDTH = 7;
//const HEIGHT = 6;

//let currPlayer = 1; // active player: 1 or 2
//let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

class Game {
  constructor(height, width) {
    this.width = width;
    this.height = height;
    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
    this.currPlayer = 1;
  }

  makeBoard() {
    console.log("makeBoard=", this.makeBoard);
    for (let y = 0; y < this.height; y++) {
      console.log("makeboard context", this);
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {

    //board.innerHTML = ""

    const board = document.getElementById('board');

    board.innerHTML = ""

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);
    console.log("board after appending=", board);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `c-${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
    console.log("board at the end of makeHTML=", board);
  }


  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    console.log("piece=", piece);
    console.log("context in placeInTable=", this);
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`c-${y}-${x}`);
    console.log("spot=", spot);
    console.log("piece after class list", piece);
    spot.append(piece);
  }

  endGame(msg) {
    console.log("msg in the endGame context =", this);
    alert(msg);
  }

  //TODO: there will be a tricky losing of context in here
  handleClick(evt) {
    // get x from ID of clicked cell
    console.log("handle click context", this);
    const x = +evt.target.id;
    console.log("handle click x", x);

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    console.log("findSpotForCol context in handleClick=", this);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    console.log("x inside of placeInTable=", x);
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }

  checkForWin() {
    console.log("check for win this", this);
    //this function
    let _win = (cells) => {

      console.log("_win this", this);
      //[[2,4],[2,5],[],[]]
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

let firstGame = new Game(6, 7);
