"use strict";
import { canvas, c, GROUND_THICKNESS } from "./global";
import { Rect, Arc } from "./shape";
import { colors } from "./utils";

addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function init() {
  resizeCanvas();

  // Ground
  new Rect({
    x: 0,
    y: innerHeight - GROUND_THICKNESS,
    w: innerWidth,
    h: GROUND_THICKNESS,
    strokeStyle: colors[1],
    velocity: { x: NaN, y: NaN },
    mass: NaN,
    fillStyle: colors[0],
  });
}

function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight - GROUND_THICKNESS);

  const player = new Arc({
    x: 150,
    y: 550,
    radius: 15,
    velocity: { x: 0, y: 0 },
    mass: 25,
    strokeStyle: colors[4],
    fillStyle: colors[4],
  });

  // Design rigid bodies
  player.update(props => {
    props.x += 1;
  });

  requestAnimationFrame(animate);
}

init();
animate();
