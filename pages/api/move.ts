import { NextApiRequest, NextApiResponse } from "next";
import {
  calculateNewPosition,
  checkNewPosition,
  getCurrentGameState,
  isGameAlreadyFinished,
} from "../../lib/server/movement/movement";
import { GameState, saveGameState } from "../../lib/server/newgame/newgame";

export default function move(req: NextApiRequest, res: NextApiResponse) {
  const gameState = getCurrentGameState(req);
  if (!gameState) return res.status(500).json({ error: "invalid" });
  const isFinished = isGameAlreadyFinished(gameState);
  if (isFinished) {
    return res.status(406).json({ error: "invalid" });
  }
  const pos = calculateNewPosition(gameState.position, req.body.direction);
  const newPos = checkNewPosition(pos);
  const state: GameState = {
    position: pos,
    sessionId: gameState.sessionId,
    state: newPos,
  };

  saveGameState(state, req, res);
  res.status(200).json({ movementResult: newPos });
}
