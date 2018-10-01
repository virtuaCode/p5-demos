let snake;
let apple;
const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const size = 20;
const block = 15;

function setup() {
  initEntities();
  frameRate(4);
  createCanvas(size * block, size * block);
}

function draw() {
  background(0);

  drawBoard();

  apple.draw();

  snake.move();
  snake.draw();

  if (!snake.isInBounds()) {
    initEntities();
    return;
  }

  if (snake.collision()) {
    initEntities();
    return;
  }

  if (snake.eatsApple(apple)) {
    apple = new Apple();
    snake.grow();
  }
}

function initEntities() {
  snake = new Snake(10, 10, 5, 2);
  apple = new Apple(11, 15);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    snake.rotateUp();
    return false;
  } else if (keyCode === DOWN_ARROW) {
    snake.rotateDown();
    return false;
  } else if (keyCode === LEFT_ARROW) {
    snake.rotateLeft();
    return false;
  } else if (keyCode === RIGHT_ARROW) {
    snake.rotateRight();
    return false;
  }
}

/**
 * Helper Functions
 */

function drawBlock(x, y, color) {
  push();

  const halfBlock = Math.floor(block / 2);

  fill(color);
  rect(block * x - halfBlock, block * y - halfBlock, block, block);

  pop();
}

function drawBoard() {
  push();

  noFill()
  stroke(255);

  const halfBlock = Math.floor(block / 2);

  rect(halfBlock, halfBlock, block * (size - 1), block * (size - 1));

  pop();
}


/**
 *    N
 *  W   E
 *    S
 * 
 *          [0, -1]
 *  [-1, 0]         [1, 0]
 *          [0, 1 ]
 */

class Snake {
  constructor(x, y, len, dir) {
    this.x = x;
    this.y = y;
    this.len = len;
    this.dir = dir;
    this.nextDir = dir;
    this.hasEatenApple = false;
    // TODO: generate tail
    this.tail = [
      new Segment(x, y - 1, color(255, 255, 255)),
      new Segment(x, y - 2, color(255, 255, 255)),
      new Segment(x, y - 3, color(255, 255, 255)),
      new Segment(x, y - 4, color(255, 255, 255))
    ];
  }

  move() {

    const last = this.tail[this.tail.length - 1];

    if (last && last.apple) {
      this.len += 1;
      last.apple = false;
    }

    if (this.len <= this.tail.length) {
      this.tail.pop();
    }
    this.tail.unshift(new Segment(this.x, this.y, color(255, 255, 255), this.hasEatenApple));

    this.hasEatenApple = false;

    const direction = directions[this.nextDir];

    const dirx = direction[0];
    const diry = direction[1];

    this.x = this.x + dirx;
    this.y = this.y + diry;

    this.dir = this.nextDir;
  }

  draw() {
    push();

    const head = new Segment(this.x, this.y, color(0, 200, 0));

    head.draw();

    for (const seg of this.tail) {
      seg.draw();
    }

    pop();
  }

  isInBounds() {
    return this.x >= 1 && this.x < size && this.y >= 1 && this.y < size;
  }

  collision() {
    return this.tail.some(seg => seg.x === this.x && seg.y === this.y);
  }

  grow() {
    this.hasEatenApple = true;
  }

  rotateLeft() {
    if (Math.abs(this.dir - 3) === 2) return;

    this.nextDir = 3;
  }

  rotateRight() {
    if (Math.abs(this.dir - 1) === 2) return;

    this.nextDir = 1;
  }

  rotateUp() {
    if (Math.abs(this.dir - 0) === 2) return;

    this.nextDir = 0;
  }

  rotateDown() {
    if (Math.abs(this.dir - 2) === 2) return;

    this.nextDir = 2;
  }

  eatsApple({ x, y }) {
    return this.x === x && this.y === y;
  }
}

class Segment {
  constructor(x, y, color, apple = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.apple = apple;
  }

  draw() {
    push();

    const c = this.apple ? color(255, 180, 180) : this.color;

    drawBlock(this.x, this.y, c);

    pop();
  }
}

class Apple {
  constructor(
    x = Math.floor(Math.random() * (size-1)) + 1,
    y = Math.floor(Math.random() * (size-1)) + 1
  ) {
    this.x = x;
    this.y = y;
  }

  draw() {
    push();

    drawBlock(this.x, this.y, color(255, 0, 0));

    pop();
  }
}