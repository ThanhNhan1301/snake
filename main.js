const { innerWidth: W_WINDOW, innerHeight: H_WINDOW } = window;
const CELL_SIZE = 15;
const COLS = Math.floor((W_WINDOW - 20) / CELL_SIZE);
const ROWS = Math.floor((H_WINDOW - 20) / CELL_SIZE);

const COLOR_MAPPING = ["white", "lightpink"];
const COLOR_LINE = "#ddd";
const COLOR_DEFAULT_ID = 0;

const ROW_MIDDLE = Math.floor(ROWS / 2);

const ctx = document.getElementById("canvas")?.getContext("2d");

const SNAKE_INITIAL = [
  { col: 0, row: ROW_MIDDLE },
  { col: 1, row: ROW_MIDDLE },
  { col: 2, row: ROW_MIDDLE },
  { col: 3, row: ROW_MIDDLE },
];

class Board {
  constructor() {
    ctx.canvas.width = CELL_SIZE * COLS;
    ctx.canvas.height = CELL_SIZE * ROWS;
    this.grid = this.generalBoardInitial();
  }

  generalBoardInitial() {
    return Array.from({ length: ROWS }).map(() => Array(COLS).fill(0));
  }

  drawCell(col, row, colorId = COLOR_DEFAULT_ID) {
    ctx.fillStyle = COLOR_MAPPING[colorId];
    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  drawLine(col, row) {
    ctx.strokeStyle = COLOR_LINE;
    ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  drawBoard() {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        this.drawCell(col, row, COLOR_DEFAULT_ID);
        this.drawLine(col, row);
      }
    }
  }
}

class Snake {
  constructor(board) {
    this.board = board;
    this.vector = "LEFT";
    this.snake_cell = SNAKE_INITIAL;
    this.snake_cell.forEach(({ col, row }) => (this.board.grid[row][col] = 1));
  }

  drawSnake() {
    this.snake_cell.forEach(({ col, row }) => {
      this.board.drawCell(col, row, 1);
      this.board.grid[row][col] = 1;
    });
  }

  clear() {
    this.snake_cell.forEach(({ col, row }) => {
      this.board.grid[row][col] = 0;
      this.board.drawCell(col, row, 0);
      this.board.drawLine(col, row);
    });
  }

  start() {
    const head_snake = this.snake_cell[this.snake_cell.length - 1];
    const tail_snake = this.snake_cell[0];
    switch (this.vector) {
      case "RIGHT":
        if (this.board.grid[head_snake.row][head_snake.col + 1] !== 1) {
          this.clear();
          this.snake_cell.shift();
          this.board.grid[tail_snake.row][tail_snake.col] = 0;
          const new_cell = {
            col: head_snake.col < COLS ? head_snake.col + 1 : 0,
            row: head_snake.row,
          };
          this.snake_cell.push(new_cell);
          this.board.grid[new_cell.row][new_cell.col] = 1;
        }
        break;
      case "LEFT":
        if (this.board.grid[tail_snake.row][tail_snake.col - 1] !== 1) {
          this.clear();
          this.snake_cell.pop();
          const new_cell = {
            col: head_snake.col > 0 ? head_snake.col - 1 : COLS - 1,
            row: head_snake.row,
          };
          this.snake_cell.push(new_cell);
          console.log(this.snake_cell);
        }
        break;
      default:
        break;
    }
    this.drawSnake();
  }
}

const board = new Board();
board.drawBoard();

const snake = new Snake(board);
snake.drawSnake();

setInterval(() => snake.start(), 200);
