export {};

const { PI, random, floor, sqrt, pow } = Math;

const COLORS = ["#027373", "#014040", "#038C7F", "#038C65"];

const canvas = document.querySelector("canvas");

const mouse = { x: innerWidth * 0.5, y: innerHeight * 0.5 };

addEventListener("mousemove", ({ clientX, clientY }) => {
  (mouse.x = clientX), (mouse.y = clientY);
});

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

resize();

const c = canvas.getContext("2d");

interface BallProps {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  strokeColor: string;
  fillColor: string;
}

class Circle {
  constructor(public props: BallProps) {}

  public draw = () => {
    const {
      props: { x, y, radius, strokeColor, fillColor },
    } = this;

    c.beginPath();
    c.arc(x, y, radius, 0, 2 * PI, false);

    (c.strokeStyle = strokeColor), (c.fillStyle = fillColor);

    c.stroke(), c.fill();
    c.closePath();
  };

  public update(): void {
    const {
      draw: drawCircle,
      props: { x, y, dx, dy, radius },
    } = this;

    drawCircle();
  }
}

const b1 = new Circle({
  x: innerWidth * 0.5,
  y: innerHeight * 0.5,
  radius: randomIntBetween(40, 50),
  dx: NaN,
  dy: NaN,
  fillColor: "blue",
  strokeColor: "red",
});

const b2 = new Circle({
  x: 0,
  y: 0,
  radius: randomIntBetween(40, 50),
  dx: NaN,
  dy: NaN,
  fillColor: "green",
  strokeColor: "cyan",
});

(function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight);

  b1.update();

  (b2.props.x = mouse.x), (b2.props.y = mouse.y);

  b2.update();

  if (distanceBetweenToCircle(b1, b2) <= b1.props.radius + b2.props.radius) {
    b1.props.fillColor = "orangeRed";
  } else {
    b1.props.fillColor = "blue";
  }

  requestAnimationFrame(animate);
})();

function randomIntBetween(min: number, max: number): number {
  return floor(random() * (max - min + 1)) + min;
}

/**
 * Retrieves distance between specified Circle A and B
 * @param CircleA Circle A
 * @param CircleB Circle B
 */
function distanceBetweenToCircle(CircleA: Circle, CircleB: Circle): number {
  const xDistance = CircleA.props.x - CircleB.props.x;
  const yDistance = CircleA.props.y - CircleB.props.y;

  return sqrt(pow(xDistance, 2) + pow(yDistance, 2));
}

/*
 // Two point distance
 function distanceBetweenToPoint(pointA: Point, pointB: Point): number {
   const xDistance = pointAx - pointBx;
   const yDistance = pointAy - pointBy;

   return sqrt(pow(xDistance, 2) + pow(yDistance, 2));
 }

 interface Point {
  x: number;
  y: number;
 }
 */
