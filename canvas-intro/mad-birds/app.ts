"use strict";
import { canvas, c, ground, GROUND_THICKNESS } from "./global";
import { Rect, Arc } from "./shape";
import { colors, withGravity } from "./utils";

addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function init() {
  ground.update();

  resizeCanvas();
}

const player = new Arc({
  drawingProps: {
    x: 150,
    y: innerHeight - 250,
    radius: 15,
  },
  velocity: { x: 0, y: 0 },
  mass: 25,
  strokeStyle: colors[4],
  fillStyle: colors[4],
});

const block = withGravity(
  new Rect({
    drawingProps: {
      x: innerWidth - 150,
      y: innerHeight - 350,
      w: 45,
      h: 45,
    },
    velocity: { x: 0, y: 0 },
    mass: 25,
    strokeStyle: colors[4],
    fillStyle: colors[4],
  }),
  1.1,
);

function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight - GROUND_THICKNESS);

  player.update();

  block.update();

  requestAnimationFrame(animate);
}

init();
animate();
