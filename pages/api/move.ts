import { NextApiRequest, NextApiResponse } from "next";
import {calculateNewPosition, checkNewPosition, getCurrentGameState, isGameAlreadyFinished} from "../../lib/server/newgame/movement";
import {GameState, saveGameState} from "../../lib/server/newgame/newgame";

export default function move(req: NextApiRequest, res: NextApiResponse) {
  const gameState: GameState = getCurrentGameState(req)
  const isFinished = isGameAlreadyFinished(gameState)
  if (isFinished) {
    return  res.status(406).json({ error: "invalid" });
  }
  const pos = calculateNewPosition(gameState, req)
  const newPos = checkNewPosition(pos)
  const state: GameState = {
    position: pos,
    sessionId: gameState.sessionId,
    state: newPos
  };
  saveGameState(state, req, res);
  res.status(200).json({ movementResult: newPos});
}
