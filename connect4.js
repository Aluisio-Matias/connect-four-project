/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
//set "board" to empty HEIGHT x WIDTH matrix array
function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({length: WIDTH}));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
//get "htmlBoard" variable from the item in HTML w/ID of "board"
function makeHtmlBoard() {
  const board = document.getElementById("board");

  //create the top of the columns where the player can click and add the piece to that column
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  board.append(top); //appending the top row to the board variable

  //Create the main part of the board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr"); //create 6 rows based on the HEIGHT=6 variable
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td"); //add 7 cells to each row WIDTH=7 variable
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    board.append(row); //appending the rows and cells to the board variable
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
//Write the real version of this, rather than always returning 0
function findSpotForCol(x) {
  for (let y = HEIGHT -1; y >= 0; y--) {
    if(!board[y][x]){
      return y;
    }
  }
  return null;
};

/** placeInTable: update DOM to place piece into HTML table of board */
//Make a div and insert into correct table cell
function placeInTable(y, x) {
  const piece = document.createElement('div'); 
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2);

  const place = document.getElementById(`${y}-${x}`);
  place.append(piece); 
}

/** endGame: announce game end */
//create pop up alert message when game is over
function endGame(msg) {
  alert(msg);
};

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // Add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} has won the game!\nYou can reset the game by reloading the page!`);
  }

  // check for tie
  // Check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {
    return endGame('This game was a tie!\nYou can reset the game by reloading the page!');
  }

  // switch players
  // switch currPlayer 1 <-> 2 -- boolean exp. if p1 played then its p2 otherwise p1 again
  currPlayer = currPlayer === 1 ? 2 : 1; 
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //checking for all conditions to find the 4 matching cells (pieces) on the game board
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      //check horizontally if all 4 pieces match 
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      //check vertically if all 4 pieces match
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      //check diagonally right if all 4 pieces match
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      //check diagonally left if all 4 pieces match

      //check if any of the conditions above are true to find the winner
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
