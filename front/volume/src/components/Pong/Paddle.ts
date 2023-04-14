import { DEFAULT_MAP_SIZE } from "./constants";
import { Point, Rect } from "./utils";

export class Paddle {
  rect: Rect;

  constructor(spawn: Point, size: Point = new Point(6, 100)) {
    this.rect = new Rect(spawn, size);
  }

  draw(context: CanvasRenderingContext2D, color: string) {
    let offset: number;
    if (this.rect.center.x < DEFAULT_MAP_SIZE.x / 2) {
      offset = this.rect.size.x / 3;
    } else {
      offset = -(this.rect.size.x / 3);
    }
    const render_rect: Rect = new Rect(
      new Point(this.rect.center.x + offset, this.rect.center.y),
      new Point(this.rect.size.x / 3, this.rect.size.y)
    );
    render_rect.draw(context, color);
  }

  move(e: MouseEvent) {
    const canvas = e.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const new_y = ((e.clientY - rect.top) * canvas.height) / rect.height;

    const offset: number = this.rect.size.y / 2;
    if (new_y - offset < 0) {
      this.rect.center.y = offset;
    } else if (new_y + offset > canvas.height) {
      this.rect.center.y = canvas.height - offset;
    } else {
      this.rect.center.y = new_y;
    }
  }
}
