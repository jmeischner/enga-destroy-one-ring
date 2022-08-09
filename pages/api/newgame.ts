import { NextApiRequest, NextApiResponse } from "next";
import {
  createUniqueSessionId,
  saveGameState,
  getStartPosition,
  GameState,
} from "../../lib/server/newgame/newgame";

export default function newGame(req: NextApiRequest, res: NextApiResponse) {
  const id = createUniqueSessionId();
  const startPosition = getStartPosition();
  const state: GameState = {
    position: startPosition,
    sessionId: id,
    state: 'path'
  };
  saveGameState(state, req, res);
  res.status(200).json({ id });
}
