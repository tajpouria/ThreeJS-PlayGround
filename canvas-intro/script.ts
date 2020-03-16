"use strict";
export {};

const canvas = document.querySelector("canvas");

function resize() {
  console.log("re");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
}

window.addEventListener("resize", resize);

const c = canvas.getContext("2d");
c.strokeStyle = "green";

const colors = ["#027373", "#014040", "#038C7F", "#038C65"];

const mouse = {
  x: NaN,
  y: NaN,
};

document.addEventListener("mousemove", ev => {
  (mouse.x = ev.x), (mouse.y = ev.y);
});

interface CircleProps {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  resizingDimension?: number;
  resizingVelocity?: number;
  color?: string;
}

class Circle {
  private dim: CircleProps;
  private resizingDimension: number;
  private resizingVelocity: number;
  private baseRadius: number;
  private color: string;

  constructor({
    resizingDimension,
    resizingVelocity,
    color,
    ...props
  }: CircleProps) {
    this.dim = props;
    this.resizingDimension =
      typeof resizingDimension === "number" ? resizingDimension : 50;

    this.resizingVelocity =
      typeof resizingVelocity === "number" ? resizingVelocity : 2;

    this.baseRadius = props.radius;

    this.color = color
      ? color
      : colors[Math.floor(Math.random() * colors.length)];
  }

  public draw = () => {
    const {
      dim: { x, y, radius },
      color,
    } = this;

    c.beginPath();
    c.arc(x, y, radius, 0, 2 * Math.PI, false);
    c.stroke();
    c.fillStyle = color;
    c.fill();
  };

  public update() {
    const {
      dim: { x, y, radius, dx, dy },
      draw: drawCircle,
      resizingDimension,
      resizingVelocity,
      baseRadius,
    } = this;

    // Circle movement
    if (x + radius >= innerWidth || x - radius <= 0) {
      this.dim.dx = -dx;
    }
    if (y + radius >= innerHeight || y - radius <= 0) {
      this.dim.dy = -dy;
    }

    this.dim.x += this.dim.dx;
    this.dim.y += this.dim.dy;

    // Circle resizing
    if (
      x - mouse.x <= resizingDimension &&
      mouse.x - x <= resizingDimension &&
      y - mouse.y <= resizingDimension &&
      mouse.y - y <= resizingDimension
    ) {
      if (!(radius >= this.baseRadius * 3)) {
        this.dim.radius += resizingVelocity;
      }
    } else if (this.dim.radius >= baseRadius) {
      this.dim.radius -= resizingVelocity;
    }

    drawCircle();
  }
}

function randomCirclePropsGenerator(): CircleProps {
  const { random } = Math;

  const radius = random() * 10 * 3 + 10;

  return {
    dx: random() - 0.5,
    dy: random() - 0.5,
    radius,
    x: random() * (innerWidth - radius * 2) + radius,
    y: random() * (innerHeight - radius * 2) + radius,
  };
}

let circles: Circle[] = [];

function init() {
  circles = [];
  circles = Array.from({ length: 100 }).map(
    () => new Circle(randomCirclePropsGenerator()),
  );
}

function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight);
  circles.forEach(cr => cr.update());
  requestAnimationFrame(animate);
}

init();
animate();
