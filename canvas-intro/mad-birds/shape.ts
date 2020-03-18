import { c as globalCtx } from "./global";

interface ShapeProps {
  x: number;
  y: number;
  velocity: { x: number; y: number };
  mass: number;
  strokeStyle?: string;
  fillStyle?: string;
}

abstract class Shape<T extends ShapeProps> {
  abstract props: T;
  abstract c: CanvasRenderingContext2D;

  private drawer: () => void | undefined;

  public draw = (drawer: () => void) => {
    const { c } = this;

    c.beginPath();

    if (this.drawer) {
      this.drawer = drawer;
    }

    const { strokeStyle, fillStyle } = this.props;

    (c.strokeStyle = strokeStyle), (c.fillStyle = fillStyle);

    drawer();

    c.stroke(), c.fill();

    c.closePath();
  };

  public update = (exec: (props: T) => void): void => {
    exec(this.props);

    const { drawer } = this;

    throw drawer
      ? this.draw(drawer)
      : new Error(`Drawer is not defined`);
  };
}

interface RectProps extends ShapeProps {
  w: number;
  h: number;
}

export class Rect extends Shape<RectProps> {
  constructor(
    public props: RectProps,
    public c: CanvasRenderingContext2D = globalCtx,
  ) {
    super();

    const { x, y, w, h } = props;

    this.draw(() => c.rect(x, y, w, h));
  }
}

interface ArcProps extends ShapeProps {
  radius: number;
  startAngle?: number;
  endAngle?: number;
}

export class Arc extends Shape<ArcProps> {
  constructor(
    public props: ArcProps,
    public c: CanvasRenderingContext2D = globalCtx,
  ) {
    super();

    const { x, y, radius, startAngle, endAngle } = props;

    this.draw(() =>
      c.arc(x, y, radius, startAngle || 0, endAngle || 2 * Math.PI),
    );
  }
}
