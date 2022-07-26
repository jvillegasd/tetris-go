const FPS = 24;
const GAME_SPEED = 5;
const SQUARE_SPRITE_SIZE = 24;
const SQUARE_CANVAS_SIZE = 40;
const BACKGROUND_COLOR = '#17a398';
const BACKGROUND_LINE_THICKNESS = 4;
const BACKGROUND_LINE_COLOR = '#e7ecef';
const BOARD_BACKGROUND_COLOR = '#6f9ceb';
const canvas = document.getElementById('game_canvas');
const nextPieceCanvas = document.getElementById('next_piece_canvas');
const spriteSheet = document.getElementById('sprite_sheet');
const ctx = canvas.getContext('2d');
const nextPieceCtx = nextPieceCanvas.getContext('2d');
const squareCountX = canvas.width / SQUARE_CANVAS_SIZE;
const squareCountY = canvas.height / SQUARE_CANVAS_SIZE;

const GAME_STATE = {
  score: 0,
  gameMap: [],
  nextPiece: null,
  currentPiece: null,
  isGameOver: false,
};

class TetrixPiece {
  constructor(imageX, imageY, template) {
    this.imageX = imageX;
    this.imageY = imageY;
    this.template = template;
    this.x = squareCountX / 2;
    this.y = 0;
  }

  draw(canvasContext, offset) {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] === 0) continue;

        canvasContext.drawImage(
          spriteSheet,
          this.imageX,
          this.imageY,
          SQUARE_SPRITE_SIZE,
          SQUARE_SPRITE_SIZE,
          SQUARE_CANVAS_SIZE * j + offset.x,
          SQUARE_CANVAS_SIZE * i + offset.y,
          SQUARE_CANVAS_SIZE,
          SQUARE_CANVAS_SIZE
        );
      }
    }
  }

  checkBottom() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (!this.template[i][j]) continue;

        let pixelX = Math.trunc(this.x) + j;
        let pixelY = Math.trunc(this.y) + i;

        if (
          pixelY + 1 >= squareCountY ||
          GAME_STATE.gameMap[pixelY + 1][pixelX].imageX !== -1
        )
          return false;
      }
    }
    return true;
  }

  checkLeft() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (!this.template[i][j]) continue;

        let pixelX = Math.trunc(this.x) + j;
        let pixelY = Math.trunc(this.y) + i;

        if (
          pixelX - 1 < 0 ||
          GAME_STATE.gameMap[pixelY][pixelX - 1].imageX !== -1
        )
          return false;
      }
    }
    return true;
  }

  checkRight() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (!this.template[i][j]) continue;

        let pixelX = Math.trunc(this.x) + j;
        let pixelY = Math.trunc(this.y) + i;

        if (
          pixelX + 1 >= squareCountX ||
          GAME_STATE.gameMap[pixelY][pixelX + 1].imageX !== -1
        )
          return false;
      }
    }
    return true;
  }

  moveBottom() {
    if (this.checkBottom()) {
      this.y += 1;
      GAME_STATE.score += 1;
    }
  }

  moveLeft() {
    if (this.checkLeft()) {
      this.x -= 1;
    }
  }

  moveRight() {
    if (this.checkRight()) {
      this.x += 1;
    }
  }

  changeRotation() {
    /*
      Rotate square matrix by 90 degrees.
      Resource: https://www.geeksforgeeks.org/inplace-rotate-square-matrix-by-90-degrees/ 
    */

    // Save current template data
    let tempTemplate = [];
    for (let i = 0; i < this.template.length; i++) {
      tempTemplate[i] = this.template[i].slice();
    }

    // Rotate Tetris piece template
    for (let i = 0; i < this.template.length / 2; i++) {
      for (let j = i; j < this.template.length - i - 1; j++) {
        let pixel = this.template[i][j];

        this.template[i][j] = this.template[j][this.template.length - i - 1];

        this.template[j][this.template.length - i - 1] =
          this.template[this.template.length - i - 1][
            this.template.length - j - 1
          ];

        this.template[this.template.length - i - 1][
          this.template.length - j - 1
        ] = this.template[this.template.length - j - 1][i];

        this.template[this.template.length - j - 1][i] = pixel;
      }
    }

    // Check if rotation is valid in game board
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (!this.template[i][j]) continue;

        let pixelX = Math.trunc(this.x) + j;
        let pixelY = Math.trunc(this.y) + i;

        if (
          pixelX < 0 ||
          pixelX >= squareCountX ||
          pixelY < 0 ||
          pixelY >= squareCountY
        ) {
          this.template = tempTemplate;
          return false;
        }
      }
    }
  }
}

const PIECES = [
  new TetrixPiece(0, 120, [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ]),
  new TetrixPiece(0, 96, [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]),
  new TetrixPiece(0, 72, [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ]),
  new TetrixPiece(0, 48, [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ]),
  new TetrixPiece(0, 24, [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ]),
  new TetrixPiece(0, 0, [
    [1, 1],
    [1, 1],
  ]),
  new TetrixPiece(0, 48, [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ]),
];

let fallCurrentPiece = () => {
  if (!GAME_STATE.currentPiece.checkBottom()) {
    const pieceTemplate = GAME_STATE.currentPiece.template;
    for (let i = 0; i < pieceTemplate.length; i++) {
      for (let j = 0; j < pieceTemplate.length; j++) {
        if (pieceTemplate[i][j] === 0) continue;

        let pixelX = Math.trunc(GAME_STATE.currentPiece.x) + j;
        let pixelY = Math.trunc(GAME_STATE.currentPiece.y) + i;

        GAME_STATE.gameMap[pixelY][pixelX] = {
          imageX: GAME_STATE.currentPiece.imageX,
          imageY: GAME_STATE.currentPiece.imageY,
        };
      }
    }
    return false;
  }

  GAME_STATE.currentPiece.y += 1;
  return true;
};

let spawnNextPiece = () => {
  GAME_STATE.currentPiece = GAME_STATE.nextPiece;
  GAME_STATE.nextPiece = getRandomPiece();
};

let lineClear = () => {
  for (let i = 0; i < GAME_STATE.gameMap.length; i++) {
    let isLineClear = true;
    let mapRow = GAME_STATE.gameMap[i];

    for (let j = 0; j < mapRow.length; j++) {
      if (mapRow[j].imageX === -1) isLineClear = false;
    }

    if (isLineClear) {
      GAME_STATE.score += 1000;

      // Move down pixels
      for (let j = i; j > 0; j--) {
        GAME_STATE.gameMap[j] = GAME_STATE.gameMap[j - 1];
      }

      // Special case: Move down pixels from row zero
      let temp = [];
      for (let j = 0; j < squareCountX; j++) {
        temp.push({ imageX: -1, imageY: -1 });
      }
      GAME_STATE.gameMap[0] = temp;
    }
  }
};

let update = () => {
  if (GAME_STATE.isGameOver) return;

  const pieceFalled = fallCurrentPiece();
  if (!pieceFalled) {
    lineClear();
    spawnNextPiece();

    if (!GAME_STATE.currentPiece.checkBottom()) {
      GAME_STATE.isGameOver = true;

      Swal.fire({
        title: "Game over!",
        text: `Your score was: ${GAME_STATE.score}, good job!`,
        icon: "error",
        confirmButtonText: "Try again"
      })
    }
  }
};

let drawRect = (canvasContext, x, y, width, height, colorHex) => {
  canvasContext.fillStyle = colorHex;
  canvasContext.fillRect(x, y, width, height);
};

let drawBackground = () => {
  drawRect(ctx, 0, 0, canvas.width, canvas.height, BACKGROUND_COLOR);

  for (let i = 0; i < squareCountX; i++) {
    drawRect(
      ctx,
      SQUARE_CANVAS_SIZE * i - BACKGROUND_LINE_THICKNESS,
      0,
      BACKGROUND_LINE_THICKNESS,
      canvas.height,
      BACKGROUND_LINE_COLOR
    );
  }
  for (let i = 0; i < squareCountY; i++) {
    drawRect(
      ctx,
      0,
      SQUARE_CANVAS_SIZE * i - BACKGROUND_LINE_THICKNESS,
      canvas.width,
      BACKGROUND_LINE_THICKNESS,
      BACKGROUND_LINE_COLOR
    );
  }
};

let drawNextPieceBoard = () => {
  drawRect(
    nextPieceCtx,
    0,
    0,
    nextPieceCanvas.width,
    nextPieceCanvas.height,
    BOARD_BACKGROUND_COLOR
  );

  const offset = {
    x: SQUARE_CANVAS_SIZE,
    y: SQUARE_CANVAS_SIZE,
  };
  GAME_STATE.nextPiece.draw(nextPieceCtx, offset);
};

let drawCurrentPiece = () => {
  const offset = {
    x: Math.trunc(GAME_STATE.currentPiece.x) * SQUARE_CANVAS_SIZE,
    y: Math.trunc(GAME_STATE.currentPiece.y) * SQUARE_CANVAS_SIZE,
  };
  GAME_STATE.currentPiece.draw(ctx, offset);
};

let drawPlacedPieces = () => {
  for (let i = 0; i < squareCountY; i++) {
    for (let j = 0; j < squareCountX; j++) {
      if (GAME_STATE.gameMap[i][j].imageX === -1) continue;

      ctx.drawImage(
        spriteSheet,
        GAME_STATE.gameMap[i][j].imageX,
        GAME_STATE.gameMap[i][j].imageY,
        SQUARE_SPRITE_SIZE,
        SQUARE_SPRITE_SIZE,
        SQUARE_CANVAS_SIZE * j,
        SQUARE_CANVAS_SIZE * i,
        SQUARE_CANVAS_SIZE,
        SQUARE_CANVAS_SIZE
      );
    }
  }
};

let draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawNextPieceBoard();
  drawCurrentPiece();
  drawPlacedPieces();
};

let getRandomPiece = () => {
  const pieceIndex = Math.floor(Math.random() * PIECES.length);
  return Object.create(PIECES[pieceIndex]);
};

let resetGameState = () => {
  GAME_STATE.gameMap = [];
  for (let i = 0; i < squareCountY; i++) {
    let mapRow = [];
    for (let j = 0; j < squareCountX; j++) {
      mapRow.push({ imageX: -1, imageY: -1 });
    }
    GAME_STATE.gameMap.push(mapRow);
  }

  GAME_STATE.score = 0;
  GAME_STATE.isGameOver = false;
  GAME_STATE.currentPiece = getRandomPiece();
  GAME_STATE.nextPiece = getRandomPiece();
};

let gameLoop = () => {
  setInterval(update, 1000 / GAME_SPEED);
  setInterval(draw, 1000 / FPS);
};

window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyA':
    case 'ArrowLeft':
      GAME_STATE.currentPiece.moveLeft();
      break;
    case 'KeyS':
    case 'ArrowDown':
      GAME_STATE.currentPiece.moveBottom();
      break;
    case 'KeyD':
    case 'ArrowRight':
      GAME_STATE.currentPiece.moveRight();
      break;
    case 'Space':
      GAME_STATE.currentPiece.changeRotation();
      break;
    default:
      break;
  }
});

let init = () => {
  resetGameState();
  gameLoop();
};

init();
