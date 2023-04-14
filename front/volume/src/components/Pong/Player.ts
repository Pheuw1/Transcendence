import type { Paddle } from "./Paddle";

export class Player {
  paddle: Paddle;
  score: number;
  name: string;

  constructor(paddle: Paddle, name: string) {
    this.paddle = paddle;
    this.score = 0;
    this.name = name;
  }

  draw(context: CanvasRenderingContext2D, color: string) {
    this.paddle.draw(context, color);
  }

  drawScore(
    score_position_x: number,
    max_width: number,
    context: CanvasRenderingContext2D
  ) {
    context.fillText(this.score.toString(), score_position_x, 50, max_width);
  }
}
