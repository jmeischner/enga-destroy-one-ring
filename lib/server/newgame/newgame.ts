import { v4 as uuidv4 } from "uuid";
import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

export const COOKIE: string = "GAMESTATE";

export interface GameState {
  readonly position: Position;
  readonly sessionId: string;
}

export const createUniqueSessionId = (): string => {
  return uuidv4();
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
