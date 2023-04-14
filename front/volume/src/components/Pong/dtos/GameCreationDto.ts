import type { Map } from "../Map";

export class GameCreationDto {
  playerNames: string[];
  map: Map;
  initialBallSpeedX: number;
  initialBallSpeedY: number;
}
