export {};

const { PI, random } = Math;

const COLORS = ["#027373", "#014040", "#038C7F", "#038C65"];
const GRAVITY = 0.9;
const BOUNCINESS = 0.9;

const canvas = document.querySelector("canvas");

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

class Ball {
  constructor(private props: BallProps) {}

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

    // Y
    if (y + radius >= innerHeight) {
      // Inverse the acceleration whenever ball hit the ground and decrease it by subtracting to BOUNCINESS
      this.props.dy = -dy * BOUNCINESS;
    } else {
      // Constantly add GRAVITY to acceleration it
      this.props.dy += GRAVITY;
    }

    // X
    if (x + radius >= innerWidth || x - radius <= 0) {
      this.props.dx = -dx * BOUNCINESS;
    }

    this.props.y += this.props.dy;
    this.props.x += this.props.dx;

    drawCircle();
  }
}

addEventListener("resize", resize);

const balls = Array.from({ length: 100 }).map(() => {
  const radius = radomIntBetween(10, 20);

  return new Ball({
    radius,
    x: radomIntBetween(radius, innerWidth - radius),
    y: radomIntBetween(radius, window.innerHeight - radius),
    dx: radomIntBetween(1, 4),
    dy: radomIntBetween(5, 7),
    strokeColor: randomFromArray(COLORS),
    fillColor: randomFromArray(COLORS),
  });
});

(function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight);

  balls.forEach(b => b.update());

  requestAnimationFrame(animate);
})();

/**
 * Retrieve a random number in specified sequence
 * @param min Left hand
 * @param max Right hand
 */
function radomIntBetween(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

/**
 * Retrieve a random element from specified list
 * @param array List to pick a random element from
 */
function randomFromArray(array: string[]) {
  return COLORS[radomIntBetween(0, array.length - 1)];
}
