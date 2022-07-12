const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const AMOUNT_X = 20;
const AMOUNT_Y = 20;

const UNIT_WIDTH = canvas.clientWidth / AMOUNT_X;
const UNIT_HEIGHT = canvas.clientHeight / AMOUNT_Y;

const map = [];

function fillMap() {
  for (let i = 0; i < AMOUNT_Y; i++) {
    const row = [];
    for (let j = 0; j < AMOUNT_X; j++) {
      row.push('black');
    }
    map.push(row);
  }
}

function set(x, y, clr) {
  map[y][x] = clr;
}

function get(x, y) {
  return map[y][x];
}

function render() {
  for (let i = 0; i < map.length; i++) {
    const row = map[i];
    for (let j = 0; j < row.length; j++) {
      ctx.fillStyle = row[j];
      ctx.fillRect(j * UNIT_WIDTH, i * UNIT_HEIGHT, UNIT_WIDTH, UNIT_HEIGHT);
    }
  }

  requestAnimationFrame(() => render());
}

const Direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};

// snake
// {x: number, y: number}
let snakeNodes = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
];
let score = 0;
let direction = Direction.RIGHT;

function loopSnake() {
  // add new node
  const nextMovement = getNextMovement();
  if (!nextMovement) {
    // game over
    console.log('game over');
    console.log('final score: ' + score);
    return;
  }
  snakeNodes.push(nextMovement);
  let hasEatenApple = false;
  if (get(nextMovement.x, nextMovement.y) === 'red') {
    hasEatenApple = true;
    score++;
    const newAppleCoords = generateAppleCoords();
    set(newAppleCoords.x, newAppleCoords.y, 'red');
  }
  if (!hasEatenApple) {
    const nodeToRemove = snakeNodes.shift();
    if (nodeToRemove) set(nodeToRemove.x, nodeToRemove.y, 'black');
  }
  set(nextMovement.x, nextMovement.y, 'white');
  setTimeout(() => loopSnake(), 100);
}

function getNextMovement() {
  const currentSnakeHead = snakeNodes[snakeNodes.length - 1];
  let newHead;
  switch (direction) {
    case Direction.UP:
      newHead = { ...currentSnakeHead, y: currentSnakeHead.y - 1 };
      break;
    case Direction.DOWN:
      newHead = { ...currentSnakeHead, y: currentSnakeHead.y + 1 };
      break;
    case Direction.LEFT:
      newHead = { ...currentSnakeHead, x: currentSnakeHead.x - 1 };
      break;
    case Direction.RIGHT:
      newHead = { ...currentSnakeHead, x: currentSnakeHead.x + 1 };
      break;
  }
  if (newHead.x < 0 || newHead.x > AMOUNT_X || newHead.y < 0 || newHead.y > AMOUNT_Y) return false;

  if (get(newHead.x, newHead.y) === 'white') return false;

  return newHead;
}

function generateAppleCoords() {
  const randX = Math.floor(AMOUNT_X * Math.random());
  const randY = Math.floor(AMOUNT_Y * Math.random());
  if (get(randX, randY) === 'red') return generateAppleCoords();
  return { x: randX, y: randY };
}

function start() {
  fillMap();
  requestAnimationFrame(() => render());
  const newAppleCoords = generateAppleCoords();
  set(newAppleCoords.x, newAppleCoords.y, 'red');
  loopSnake();
}

window.addEventListener('keydown', (evt) => {
  evt.preventDefault();

  switch (evt.key) {
    case 'ArrowUp':
      direction = direction !== Direction.DOWN ? Direction.UP : direction;
      break;
    case 'ArrowDown':
      direction = direction !== Direction.UP ? Direction.DOWN : direction;
      break;
    case 'ArrowLeft':
      direction = direction !== Direction.RIGHT ? Direction.LEFT : direction;
      break;
    case 'ArrowRight':
      direction = direction !== Direction.LEFT ? Direction.RIGHT : direction;
      break;
  }
});

start();
