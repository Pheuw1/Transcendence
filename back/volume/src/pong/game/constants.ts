import { Point } from './utils'

export const GAME_EVENTS = {
  START_GAME: 'START_GAME',
  READY: 'READY',
  GAME_TICK: 'GAME_TICK',
  PLAYER_MOVE: 'PLAYER_MOVE',
  GET_GAME_INFO: 'GET_GAME_INFO',
  CREATE_GAME: 'CREATE_GAME',
  REGISTER_PLAYER: 'REGISTER_PLAYER',
  MATCHMAKING: 'MATCHMAKING',
  LEAVE_GAME: 'LEAVE_GAME'
}

export const DEFAULT_MAP_SIZE = new Point(500, 400)
export const DEFAULT_PADDLE_SIZE = new Point(30, 50)
export const DEFAULT_BALL_SIZE = new Point(10, 10)
export const DEFAULT_BALL_INITIAL_SPEED = new Point(10, 2)
export const DEFAULT_MAX_BALL_SPEED = new Point(20, 20)
export const DEFAULT_BALL_SPEED_INCREMENT = new Point(0.05, 0)
export const DEFAULT_WIN_SCORE = 5
export const GAME_TICKS = 30
