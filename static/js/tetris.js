const FPS = 24;
const GAME_SPEED = 5;
const SQUARE_SPRITE_SIZE = 24;
const SQUARE_CANVAS_SIZE = 40;
const canvas = document.getElementById('game_canvas');
const spriteSheet = document.getElementById('sprite_sheet');
const ctx = canvas.getContext('2d');
const squareCountX = canvas.width / SQUARE_CANVAS_SIZE;
const squareCountY = canvas.height / SQUARE_CANVAS_SIZE;

class TetrixPiece {
  constructor(imageX, imageY, template) {
    this.imageX = imageX;
    this.imageY = imageY;
    this.template = template;
  }

  checkBottom() {}

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
}

let update = () => {

}

let draw = () => {
  
}

gameLoop();