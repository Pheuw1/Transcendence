import { type Point, type Rect } from '../game/utils'

export class GameInfo {
  mapSize!: Point
  yourPaddleIndex!: number
  gameId!: string
  walls!: Rect[]
  paddleSize!: Point
  ballSize!: Point
  winScore!: number
  ranked!: boolean
  playerNames!: string[]
}
