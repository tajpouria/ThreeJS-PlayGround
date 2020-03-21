import { Rect } from "./shape";
import { colors } from "./utils";

export const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d");

// Constants

export const GROUND_THICKNESS = 120;
export const GRAVITY = 0.9;

// Ground
export const ground = new Rect({
  drawingProps: {
    x: 0,
    y: innerHeight - GROUND_THICKNESS,
    w: innerWidth,
    h: GROUND_THICKNESS,
  },
  strokeStyle: colors[1],
  velocity: { x: NaN, y: NaN },
  mass: NaN,
  fillStyle: colors[0],
});
