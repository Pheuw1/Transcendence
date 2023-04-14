import { type Paddle } from './Paddle'
import { type Point, Rect } from './utils'
import { type MapDtoValidated } from '../dtos/MapDtoValidated'
import {
  DEFAULT_BALL_SIZE,
  GAME_TICKS,
  DEFAULT_BALL_SPEED_INCREMENT,
  DEFAULT_MAX_BALL_SPEED
} from './constants'

export class Ball {
  rect: Rect
  initial_speed: Point
  speed: Point
  spawn: Point
  indexPlayerScored: number
  timeoutTime: number

  constructor (
    spawn: Point,
    initialSpeed: Point,
    size: Point = DEFAULT_BALL_SIZE.clone()
  ) {
    this.rect = new Rect(spawn, size)
    this.speed = initialSpeed.clone()
    this.initial_speed = initialSpeed.clone()
    this.spawn = spawn.clone()
    this.indexPlayerScored = -1
    this.timeoutTime = 0
  }

  getIndexPlayerScored (): number {
    return this.indexPlayerScored
  }

  update (canvasRect: Rect, paddles: Paddle[], map: MapDtoValidated): void {
    if (!canvasRect.contains_x(this.rect)) {
      this.indexPlayerScored = this.playerScored()
      this.timeoutTime = 2000
    } else {
      this.indexPlayerScored = -1
      if (this.timeoutTime <= 0) {
        this.move(canvasRect, paddles, map)
      } else {
        this.timeoutTime -= 1000 / GAME_TICKS
      }
    }
  }

  move (canvasRect: Rect, paddles: Paddle[], map: MapDtoValidated): void {
    for (const paddle of paddles) {
      if (paddle.rect.collides(this.rect)) {
        if (this.speed.x < 0) {
          this.rect.center.x = paddle.rect.center.x + paddle.rect.size.x
        } else this.rect.center.x = paddle.rect.center.x - paddle.rect.size.x
        this.speed.x = this.speed.x * -1
        this.speed.y =
          ((this.rect.center.y - paddle.rect.center.y) / paddle.rect.size.y) *
          20
        break
      }
    }

    for (const wall of map.walls) {
      if (wall.collides(this.rect)) {
        if (this.speed.x < 0) {
          this.rect.center.x = wall.center.x + wall.size.x
        } else this.rect.center.x = wall.center.x - wall.size.x
        this.speed.x = this.speed.x * -1
        this.speed.y =
          ((this.rect.center.y - wall.center.y) / wall.size.y) * 20
        break
      }
    }

    if (!canvasRect.contains_y(this.rect)) this.speed.y = this.speed.y * -1

    if (this.speed.x > 0 && this.speed.x < DEFAULT_MAX_BALL_SPEED.x) {
      this.speed.x += DEFAULT_BALL_SPEED_INCREMENT.x
    }
    if (this.speed.x < 0 && this.speed.x > -DEFAULT_MAX_BALL_SPEED.x) {
      this.speed.x -= DEFAULT_BALL_SPEED_INCREMENT.x
    }
    if (this.speed.y > 0 && this.speed.y > DEFAULT_MAX_BALL_SPEED.y) {
      this.speed.y += DEFAULT_MAX_BALL_SPEED.y
    }
    if (this.speed.y < 0 && this.speed.y < -DEFAULT_MAX_BALL_SPEED.y) {
      this.speed.y -= DEFAULT_MAX_BALL_SPEED.y
    }
    this.rect.center.add_inplace(this.speed)
  }

  playerScored (): number {
    let indexPlayerScored: number

    if (this.rect.center.x <= this.spawn.x) {
      indexPlayerScored = 1
      this.speed.x = this.initial_speed.x
    } else {
      indexPlayerScored = 0
      this.speed.x = -this.initial_speed.x
    }

    if (this.speed.y < 0) {
      this.speed.y = this.initial_speed.y
    } else {
      this.speed.y = -this.initial_speed.y
    }

    this.rect.center = this.spawn.clone()

    return indexPlayerScored
  }
}
