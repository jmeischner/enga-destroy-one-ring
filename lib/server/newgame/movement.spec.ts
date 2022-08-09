import {GameState, Position, saveGameState} from "./newgame";
import { calculateNewPosition,  checkNewPosition, isGameAlreadyFinished} from "./movement";
import * as cookies from "cookies-next";
import {NextApiRequest, NextApiResponse} from "next";

jest.mock("cookies-next", () => {
    return {
      getCookie: jest.fn(),
    };
  });

describe("movement", () => {
    test("should return a movement Result", () => {
        const pos: Position = new Position(0, 5) 
      const testGameState:GameState = {position: pos, sessionId: '42', state: 'path'}
      const finished: boolean = isGameAlreadyFinished(testGameState)
      if (!finished) {
        calculateNewPosition(testGameState, {} as NextApiRequest)
        checkNewPosition(pos)
        saveGameState(testGameState, {} as NextApiRequest, {} as NextApiResponse);
      }
    });
  });

  describe("calculateNewPosition", () => {
    test("should calculate a new position", () => {
        
    });
  });

  describe("checkNewPosition", () => {
    test("should check a position", () => {
        const pos: Position = new Position(0, 5)
        expect(checkNewPosition(pos)).toBe('path') 
    });
  });

  describe("isGameAlreadyFinished", () => {
    test("should check if game is already finished", () => {
        const pos: Position = new Position(0, 5) 
        const testGameState:GameState = {position: pos, sessionId: '42', state: 'path'}
        expect(isGameAlreadyFinished(testGameState)).toBeFalsy()
    });
  });