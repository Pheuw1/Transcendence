import { type Socket } from 'socket.io'
import { type GameCreationDtoValidated } from '../dtos/GameCreationDtoValidated'
import { DEFAULT_BALL_INITIAL_SPEED, DEFAULT_MAP_SIZE } from './constants'
import { type Games } from './Games'

export class MatchmakingQueue {
  games: Games
  queue: Array<{ name: string, socket: Socket, uuid: string }>

  constructor (games: Games) {
    this.games = games
    this.queue = []
  }

  addPlayer (name: string, socket: Socket, uuid: string): void {
    if (!this.isInQueue(name)) {
      console.log('Adding player to queue: ', name)
      this.queue.push({ name, socket, uuid })
      if (this.canCreateGame()) {
        this.createGame()
      }
    }
  }

  removePlayer (name: string): void {
    if (this.isInQueue(name)) {
      console.log('Removing player from queue: ', name)
      this.queue = this.queue.filter((player) => player.name !== name)
    }
  }

  isInQueue (name: string): boolean {
    return this.queue.some((player) => player.name === name)
  }

  canCreateGame (): boolean {
    return this.queue.length >= 2
  }

  createGame (): void {
    const player1 = this.queue.shift()
    const player2 = this.queue.shift()
    if (player1 === undefined || player2 === undefined) {
      return
    }
    const gameCreationDto: GameCreationDtoValidated = {
      playerNames: [player1.name, player2.name],
      map: {
        size: DEFAULT_MAP_SIZE,
        walls: []
      },
      initialBallSpeedX: DEFAULT_BALL_INITIAL_SPEED.x,
      initialBallSpeedY: DEFAULT_BALL_INITIAL_SPEED.y
    }
    const ranked = true

    this.games.newGame(
      [player1.socket, player2.socket],
      [player1.uuid, player2.uuid],
      gameCreationDto,
      ranked
    )
  }
}
