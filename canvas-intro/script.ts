export {};

const canvas = document.querySelector("canvas");
canvas.style.backgroundColor = "#402401";
const colors = ["#D9CB04", "#D9B504", "#8C7503", "#735702"];

const c = canvas.getContext("2d");

const mouse = {
  props: {
    x: innerWidth / 2,
    y: innerHeight / 2,
    radius: 15,
  },
};

addEventListener("mousemove", ({ clientX, clientY }) => {
  mouse.props.x = clientX;
  mouse.props.y = clientY;
});

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
}

addEventListener("resize", resize);

interface PartialProps {
  x: number;
  y: number;
  radius: number;
  velocity: { x: number; y: number };
  mass: number;
  strokeColor: string;
  fillColor: string;
}

class Particle {
  private opacity = 0.2;
  constructor(public props: PartialProps) {}

  public draw = (): void => {
    const {
      props: { x, y, radius, fillColor, strokeColor },
      opacity,
    } = this;

    c.beginPath();

    c.arc(x, y, radius, 0, Math.PI * 2);

    c.strokeStyle = strokeColor;
    c.fillStyle = fillColor;
    c.stroke();

    c.save(); // Applying globalAlpha just for fill() because it wrapped within save() and restore()
    c.globalAlpha = opacity;
    c.fill();
    c.restore();

    c.closePath();
  };

  public update(partialList: Array<Particle>): void {
    const {
      props: { x, y, radius, velocity },
      draw: drawCircle,
    } = this;

    // Right and left range
    if (x + radius >= innerWidth || x - radius <= 0) {
      this.props.velocity.x = -velocity.x;
    }

    // Up and down range
    if (y + radius >= innerHeight || y - radius <= 0) {
      this.props.velocity.y = -velocity.y;
    }

    // Collide detection
    partialList.forEach(par => {
      if (par !== this && distanceBetweenTwoCircle(this, par) <= 0) {
        resolveCollision(this, par);
      }
    });

    // Hover effect
    if (distanceBetweenTwoCircle(this, mouse) <= 50 && this.opacity <= 0.2) {
      this.opacity += 0.03;
    } else if (this.opacity > 0) {
      this.opacity -= 0.01;

      this.opacity = Math.max(0, this.opacity);
    }

    // Movement
    this.props.x += this.props.velocity.x;
    this.props.y += this.props.velocity.y;

    drawCircle();
  }
}

let partials: Array<Particle> = [];

function init() {
  partials = [];

  for (let i = 0; i <= 200; i++) {
    const radius = randomIntBetween(10, 20);

    const newlyCreatedPartial = new Particle({
      x: randomIntBetween(radius, innerWidth - radius),
      y: randomIntBetween(radius, innerHeight - radius),
      radius,
      velocity: {
        x: randomIntBetween(-0.5, 0.5),
        y: randomIntBetween(-0.5, 0.5),
      },
      mass: radius,
      strokeColor: "white",
      fillColor: pickRandomValueFrom(colors),
    });

    for (let j = 0; j < partials.length; j++) {
      const par = partials[j] as Particle;

      if (distanceBetweenTwoCircle(par, newlyCreatedPartial) <= 0) {
        newlyCreatedPartial.props.x = randomIntBetween(
          radius,
          innerWidth - radius,
        );

        newlyCreatedPartial.props.y = randomIntBetween(
          radius,
          innerHeight - radius,
        );

        j = -1;
      }
    }

    partials.push(newlyCreatedPartial);
  }
}

function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight);

  partials.forEach((par, _, list) => par.update(list));

  requestAnimationFrame(animate);
}

resize();
init();
animate();

/**
 * Generate random value in specified range
 * @param min
 * @param max
 */
function randomIntBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Pick a random element from specified list
 * @param array
 */
function pickRandomValueFrom<T = any>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

interface Circle {
  props: {
    x: number;
    y: number;
    radius: number;
  };
}

/**
 * Retrieve distance between two circle
 * @param circleA
 * @param circleB
 */
function distanceBetweenTwoCircle(circleA: Circle, circleB: Circle) {
  const {
    props: { x: xA, y: yA, radius: rA },
  } = circleA;

  const {
    props: { x: xB, y: yB, radius: rB },
  } = circleB;

  const xDistance = xA - xB;
  const yDistance = yA - yB;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)) - (rA + rB);
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  velocity | The velocity of an individual particle
 * @param  angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity: { x: number; y: number }, angle: number) {
  return {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  particle      | A particle object with x and y coordinates, plus velocity
 * @param  otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle: Particle, otherParticle: Particle) {
  const xVelocityDiff =
    particle.props.velocity.x - otherParticle.props.velocity.x;
  const yVelocityDiff =
    particle.props.velocity.y - otherParticle.props.velocity.y;

  const xDist = otherParticle.props.x - particle.props.x;
  const yDist = otherParticle.props.y - particle.props.y;

  // Prevent accidental overlap of particle
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particle.props
    const angle = -Math.atan2(
      otherParticle.props.y - particle.props.y,
      otherParticle.props.x - particle.props.x,
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.props.mass;
    const m2 = otherParticle.props.mass;

    // Velocity before equation
    const u1 = rotate(particle.props.velocity, angle);
    const u2 = rotate(otherParticle.props.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.props.velocity.x = vFinal1.x;
    particle.props.velocity.y = vFinal1.y;

    otherParticle.props.velocity.x = vFinal2.x;
    otherParticle.props.velocity.y = vFinal2.y;
  }
}
