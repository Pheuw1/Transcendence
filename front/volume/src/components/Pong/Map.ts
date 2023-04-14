import type { Point, Rect } from "./utils";

export class Map {
  size: Point;
  walls: Rect[];

  constructor(size: Point, walls: Rect[]) {
    this.size = size;
    this.walls = walls;
  }
}
