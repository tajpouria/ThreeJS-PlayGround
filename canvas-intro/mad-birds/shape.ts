import { c as globalCtx } from "./global";

interface DrawingProps {
  x: number;
  y: number;
}

interface ShapeProps {
  drawingProps: DrawingProps;
  velocity: { x: number; y: number };
  mass: number;
  strokeStyle?: string;
  fillStyle?: string;
}

type Drawer<S extends DrawingProps> = (args: S) => void;

type Executable<T> = (shape: T) => void;

export abstract class Shape<
  S extends DrawingProps = DrawingProps,
  T extends ShapeProps = ShapeProps
> {
  abstract props: T;
  abstract c: CanvasRenderingContext2D;
  abstract top: number;
  abstract right: number;
  abstract bottom: number;
  abstract left: number;

  private drawer: Drawer<S> | undefined;

  private executableList: Executable<this>[] = [];

  public draw = (drawer?: Drawer<S>) => {
    const { c } = this;

    if (drawer && !this.drawer) {
      this.drawer = drawer;
    }

    c.beginPath();

    const { strokeStyle, fillStyle, drawingProps } = this.props;

    (c.strokeStyle = strokeStyle), (c.fillStyle = fillStyle);

    // TODO: as any!
    drawer(drawingProps as any);

    c.stroke(), c.fill();

    c.closePath();
  };

  public update = (exec?: Executable<this>): void => {
    const {
      drawer,
      props: { velocity },
    } = this;

    if (exec) {
      this.executableList.push(exec);
    }

    this.executableList.forEach(e => e(this));

    this.props.drawingProps.x += velocity.x;
    this.props.drawingProps.y += velocity.y;

    drawer ? this.draw(drawer) : new Error(`Drawer is not defined`);
  };

  public haveCollisionWith(shape: Shape): boolean {
    const { top, right, bottom, left } = this;

    if (
      top > shape.bottom ||
      right < shape.left ||
      bottom < shape.top ||
      left > shape.right
    ) {
      return false;
    }
    return true;
  }
}

interface RectDrawingProps extends DrawingProps {
  w: number;
  h: number;
}

interface RectProps extends ShapeProps {
  drawingProps: RectDrawingProps;
}

export class Rect extends Shape<RectDrawingProps, RectProps> {
  constructor(
    public props: RectProps,
    public c: CanvasRenderingContext2D = globalCtx,
  ) {
    super();

    this.draw(({ x, y, w, h }) => c.rect(x, y, w, h));
  }

  get top() {
    const { y } = this.props.drawingProps;
    return y;
  }

  get right() {
    const { x, w } = this.props.drawingProps;
    return x + w;
  }

  get bottom() {
    const { y, h } = this.props.drawingProps;
    return y + h;
  }

  get left() {
    const { x } = this.props.drawingProps;
    return x;
  }
}

interface ArcDrawingProps extends DrawingProps {
  radius: number;
  startAngle?: number;
  endAngle?: number;
}

interface ArcProps extends ShapeProps {
  drawingProps: ArcDrawingProps;
}

export class Arc extends Shape<ArcDrawingProps, ArcProps> {
  constructor(
    public props: ArcProps,
    public c: CanvasRenderingContext2D = globalCtx,
  ) {
    super();

    this.draw(({ x, y, radius, startAngle, endAngle }) =>
      c.arc(x, y, radius, startAngle || 0, endAngle || 2 * Math.PI),
    );
  }

  get top() {
    const { y } = this.props.drawingProps;
    return y;
  }

  get right() {
    const { x, radius } = this.props.drawingProps;
    return x + radius;
  }

  get bottom() {
    const { y, radius } = this.props.drawingProps;
    return y + radius;
  }

  get left() {
    const { x } = this.props.drawingProps;
    return x;
  }
}
