let creatureTime = 0;
let creatureSpeed = 0.02;
let isPaused = false;

let orbX, orbY;
let orbVelocityX = 0;
let orbVelocityY = 0;
let orbSpin = 0;
let orbInFlight = false;
let score = 0;
let flashFrames = 0;

const GRAVITY = 0.25;
const ORB_RADIUS = 14;
const CREATURE_RADIUS = 32;
const THROW_START_X = 80;
const THROW_START_Y = 380;
const PATH_WIDTH = 150;
const PATH_HEIGHT = 80;
const PATH_CENTER_X = 520;
const PATH_CENTER_Y = 170;

function setup() {
  createCanvas(800, 450);
  resetOrb();
}

function draw() {
  background(30, 50, 45);
  drawGround();

  if (!isPaused) {
    creatureTime += creatureSpeed;
  }

  let creatureX = PATH_CENTER_X + PATH_WIDTH * sin(creatureTime);
  let creatureY = PATH_CENTER_Y + PATH_HEIGHT * sin(2 * creatureTime);

  let squash = 1 + 0.12 * sin(creatureTime * 6);

  if (orbInFlight && !isPaused) {
    orbVelocityY += GRAVITY;
    orbX += orbVelocityX;
    orbY += orbVelocityY;
    orbSpin += orbVelocityX / ORB_RADIUS;

    let gap = dist(orbX, orbY, creatureX, creatureY);
    if (gap < ORB_RADIUS + CREATURE_RADIUS) {
      score++;
      flashFrames = 30;
      resetOrb();
    } else if (orbY > height || orbX > width) {
      resetOrb();
    }
  }

  drawAimGuide();
  drawCreature(creatureX, creatureY, squash);
  drawOrb();

  if (flashFrames > 0) {
    fill(255, 240, 120);
    textSize(28);
    textAlign(CENTER, CENTER);
    text("Caught!", width / 2, height / 2);
    flashFrames--;
  }
  drawInstructions();
}

function drawAimGuide() {
  if (orbInFlight) return;
  let vx = (mouseX - THROW_START_X) * 0.045;
  let vy = (mouseY - THROW_START_Y) * 0.045;
  fill(255, 255, 255, 120);
  noStroke();
  for (let step = 0; step < 25; step += 2) {
    let guideX = THROW_START_X + vx * step;
    let guideY = THROW_START_Y + vy * step + 0.5 * GRAVITY * step * step;
    circle(guideX, guideY, 4);
  }
}

function drawCreature(x, y, squash) {
  noStroke();
  fill(150, 120, 230);
  ellipse(x, y, CREATURE_RADIUS * 2 / squash, CREATURE_RADIUS * 2 * squash);
  fill(255);
  circle(x - 10, y - 6, 12);
  circle(x + 10, y - 6, 12);
  fill(30);
  circle(x - 10, y - 6, 5);
  circle(x + 10, y - 6, 5);
}

function drawOrb() {
  push();
  translate(orbX, orbY);
  rotate(orbSpin);
  noStroke();
  fill(70, 190, 170);
  circle(0, 0, ORB_RADIUS * 2);
  fill(255, 220, 90);
  rect(-ORB_RADIUS, -2, ORB_RADIUS * 2, 4);
  pop();
}

function drawGround() {
  noStroke();
  fill(60, 90, 60);
  rect(0, 400, width, 50);
}

function drawInstructions() {
  noStroke();
  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  text("Controls:", 15, 12);
  text("Move mouse = aim (dots show the arc)", 15, 32);
  text("Click = throw orb", 15, 52);
  text("SPACE = pause    UP / DOWN = creature speed", 15, 72);
  text("Caught: " + score, 15, 100);
}

function resetOrb() {
  orbX = THROW_START_X;
  orbY = THROW_START_Y;
  orbVelocityX = 0;
  orbVelocityY = 0;
  orbInFlight = false;
}

function mousePressed() {
  if (!orbInFlight && !isPaused) {

    orbVelocityX = (mouseX - THROW_START_X) * 0.045;
    orbVelocityY = (mouseY - THROW_START_Y) * 0.045;
    orbInFlight = true;
  }
}

function keyPressed() {
  if (key === ' ') isPaused = !isPaused;
  if (keyCode === UP_ARROW) creatureSpeed = min(creatureSpeed + 0.005, 0.08);
  if (keyCode === DOWN_ARROW) creatureSpeed = max(creatureSpeed - 0.005, 0.005);
  return false;
}
