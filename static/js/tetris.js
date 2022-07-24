const FPS = 24;
const GAME_SPEED = 5;
const SQUARE_SPRITE_SIZE = 24;
const SQUARE_CANVAS_SIZE = 40;
const BACKGROUND_COLOR = '#17a398';
const BACKGROUND_LINE_THICKNESS = 4;
const BACKGROUND_LINE_COLOR = '#e7ecef';
const canvas = document.getElementById('game_canvas');
const spriteSheet = document.getElementById('sprite_sheet');
const ctx = canvas.getContext('2d');
const squareCountX = canvas.width / SQUARE_CANVAS_SIZE;
const squareCountY = canvas.height / SQUARE_CANVAS_SIZE;

const GAME_STATE = {
  score: 0,
  gameMap: [],
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

  draw() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        ctx.drawImage(
          spriteSheet,
          this.imageX,
          this.imageY,
          SQUARE_SPRITE_SIZE,
          SQUARE_SPRITE_SIZE,
          Math.trunc(this.x) * SQUARE_CANVAS_SIZE + SQUARE_CANVAS_SIZE * i,
          Math.trunc(this.y) * SQUARE_CANVAS_SIZE + SQUARE_CANVAS_SIZE * j,
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

  checkLeft() {}

  checkRight() {}

  moveBottom() {}

  moveLeft() {}

  moveRight() {}

  changeRotation() {}
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

let gameLoop = () => {
  setInterval(update, 1000 / GAME_SPEED);
  setInterval(draw, 1000 / FPS);
};

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

let update = () => {
  if (GAME_STATE.isGameOver) return;

  const pieceFalled = fallCurrentPiece();
  if (!pieceFalled) {
    GAME_STATE.currentPiece = getRandomPiece();
  }
};

let drawRect = (x, y, width, height, colorHex) => {
  ctx.fillStyle = colorHex;
  ctx.fillRect(x, y, width, height);
};

let drawBackground = () => {
  drawRect(0, 0, canvas.width, canvas.height, BACKGROUND_COLOR);
  for (let i = 0; i < squareCountX; i++) {
    drawRect(
      SQUARE_CANVAS_SIZE * i - BACKGROUND_LINE_THICKNESS,
      0,
      BACKGROUND_LINE_THICKNESS,
      canvas.height,
      BACKGROUND_LINE_COLOR
    );
  }
  for (let i = 0; i < squareCountY; i++) {
    drawRect(
      0,
      SQUARE_CANVAS_SIZE * i - BACKGROUND_LINE_THICKNESS,
      canvas.width,
      BACKGROUND_LINE_THICKNESS,
      BACKGROUND_LINE_COLOR
    );
  }
};

let draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  GAME_STATE.currentPiece.draw();
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
};

let init = () => {
  resetGameState();
  gameLoop();
};

init();
