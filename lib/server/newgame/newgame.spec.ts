import {
  COOKIE,
  createUniqueSessionId,
  GameState,
  getStartPosition,
  Position,
  saveGameState,
} from "./newgame";

import random from "random";
import * as cookies from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

// const mockV4 = jest.fn();
// const mockSetCookies = jest.fn();

jest.mock("random", () => {
  return {
    int: jest.fn().mockReturnValue(42),
  };
});

jest.mock("cookies-next", () => {
  return {
    setCookie: jest.fn(),
  };
});

describe("newGame's", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("createUniqueSessionId", () => {
    test("should return a random value", () => {
      createUniqueSessionId();
      expect(random.int).toHaveBeenCalled();
    });
  });

  describe("getStartPosition", () => {
    test("should return a Postion with (x:0, y:5)", () => {
      const startPosition = getStartPosition();
      expect(startPosition instanceof Position).toBeTruthy();
      expect(startPosition.x).toBe(0);
      expect(startPosition.y).toBe(5);
    });
  });

  describe("saveGameState", () => {
    test("should set the startPosition as cookie", () => {
      const startPosition = getStartPosition();
      const testGameState: GameState = {
        position: startPosition,
        sessionId: "42",
        state: "path",
      };
      saveGameState(testGameState, {} as NextApiRequest, {} as NextApiResponse);
      expect(cookies.setCookie).toHaveBeenCalledWith(
        COOKIE,
        testGameState,
        expect.anything()
      );
    });
  });
});
