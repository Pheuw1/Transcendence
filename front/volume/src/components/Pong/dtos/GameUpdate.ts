import type { Point } from "../utils";

export class GameUpdate {
  paddlesPositions!: Point[];
  ballSpeed!: Point;
  ballPosition!: Point;
  scores!: number[];
}
