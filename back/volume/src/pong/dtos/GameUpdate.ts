import { type Point } from '../game/utils'

export class GameUpdate {
  paddlesPositions!: Point[]
  ballSpeed!: Point
  ballPosition!: Point
  scores!: number[]
}
