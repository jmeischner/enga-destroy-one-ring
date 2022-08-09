import random from "random";
import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { MovementResult } from "../movement/movement";

export const COOKIE: string = "GAMESTATE";

export interface GameState {
  readonly position: Position;
  readonly sessionId: string;
  readonly state: MovementResult;
}

export const createUniqueSessionId = (): string => {
  return random.int(0, 99999999).toString();
};

export const getStartPosition = (): Position => {
  return new Position(0, 5);
};

export const saveGameState = (
  gamestate: GameState,
  req: NextApiRequest,
  res: NextApiResponse
): void => {
  setCookie(COOKIE, gamestate, { req, res });
};

export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
