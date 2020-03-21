import { Shape } from "./shape";
import { GRAVITY, ground } from "./global";

export const colors = {
  0: "#F2AA6B",
  1: "#D9763D",
  2: "#BF5A36",
  3: "#8C2E0B",
  4: "#591902",
};

export function withGravity(shape: Shape, bounciness: number) {
  shape.update(shape => {
    const {
      velocity: { y: dy },
    } = shape.props;

    // Y
    if (!shape.haveCollisionWith(ground)) {
      // Inverse the acceleration whenever ball hit the ground and decrease it by subtracting to BOUNCINESS
      shape.props.velocity.y = -dy * bounciness;
    } else {
      // Constantly add GRAVITY to acceleration it
      shape.props.velocity.y += GRAVITY;
    }
  });

  return shape;
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

export function resolveCollision(particle: Shape, otherParticle: Shape) {
  const xVelocityDiff =
    particle.props.velocity.x - otherParticle.props.velocity.x;
  const yVelocityDiff =
    particle.props.velocity.y - otherParticle.props.velocity.y;

  const xDist =
    otherParticle.props.drawingProps.x - particle.props.drawingProps.x;
  const yDist =
    otherParticle.props.drawingProps.y - particle.props.drawingProps.y;

  // Prevent accidental overlap of particle
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particle.props
    const angle = -Math.atan2(
      otherParticle.props.drawingProps.y - particle.props.drawingProps.y,
      otherParticle.props.drawingProps.x - particle.props.drawingProps.x,
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
