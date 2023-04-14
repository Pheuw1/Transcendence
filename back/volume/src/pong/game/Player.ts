import { type Socket } from 'socket.io'
import { Paddle } from './Paddle'
import { type Point } from './utils'

export class Player {
  socket: Socket
  uuid: string
  name: string
  ready: boolean
  paddle: Paddle
  paddleCoords: Point
  mapSize: Point
  score: number

  constructor (
    socket: Socket,
    uuid: string,
    name: string,
    paddleCoords: Point,
    mapSize: Point
  ) {
    this.socket = socket
    this.uuid = uuid
    this.name = name
    this.ready = false
    this.paddle = new Paddle(paddleCoords, mapSize)
    this.paddleCoords = paddleCoords
    this.mapSize = mapSize
    this.score = 0
  }

  newGame (): void {
    this.score = 0
    this.paddle = new Paddle(this.paddleCoords, this.mapSize)
  }
}
