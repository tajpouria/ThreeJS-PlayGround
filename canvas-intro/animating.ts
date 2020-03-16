"use strict";
export {};

const canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;

const c = canvas.getContext("2d");
c.strokeStyle = "cyan";

interface CircleProps {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
}

class Circle {
  private dim: CircleProps;

  constructor({ ...props }: CircleProps) {
    this.dim = props;
  }

  public draw = () => {
    const { x, y, radius } = this.dim;

    c.beginPath();
    c.arc(x, y, radius, 0, 2 * Math.PI, false);
    c.stroke();
    c.fillStyle = "rgba(255 , 255, 255, 0.1)";
    c.fill();
  };

  public update() {
    const {
      dim: { x, y, radius, dx, dy },
      draw: drawCircle,
    } = this;

    if (x + radius >= innerWidth || x - radius <= 0) {
      this.dim.dx = -dx;
    }

    if (y + radius >= innerHeight || y - radius <= 0) {
      this.dim.dy = -dy;
    }

    this.dim.x += this.dim.dx;
    this.dim.y += this.dim.dy;

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

const circles = Array.from({ length: 100 }).map(
  () => new Circle(randomCirclePropsGenerator()),
);

function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight);
  circles.forEach(cr => cr.update());
  requestAnimationFrame(animate);
}

animate();
