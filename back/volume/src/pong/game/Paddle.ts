import { DEFAULT_PADDLE_SIZE } from './constants'
import { type Point, Rect } from './utils'

export class Paddle {
  rect: Rect
  color: string | CanvasGradient | CanvasPattern = 'white'
  mapSize: Point

  constructor (
    spawn: Point,
    gameSize: Point,
    size: Point = DEFAULT_PADDLE_SIZE
  ) {
    this.rect = new Rect(spawn, size)
    this.mapSize = gameSize
  }

  draw (context: CanvasRenderingContext2D): void {
    this.rect.draw(context, this.color)
  }

  move (newY: number): void {
    const offset: number = this.rect.size.y / 2
    if (newY - offset < 0) {
      this.rect.center.y = offset
    } else if (newY + offset > this.mapSize.y) {
      this.rect.center.y = this.mapSize.y - offset
    } else {
      this.rect.center.y = newY
    }
  }
}
