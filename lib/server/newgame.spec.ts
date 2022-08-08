import {
  createUniqueSessionId,
  getStartPosition,
  saveGameState,
} from "./newgame";
import { Position } from "./newgame";

import * as cookies from "cookies-next";
import * as uuid from "uuid";

const v4 = jest.fn();
const setCookies = jest.fn();

jest.mock("uuid", () => {
  return {
    v4,
  };
});

jest.mock("cookies-next", () => {
  return {
    setCookies,
  };
});

describe("newGame's", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("createUniqueSessionId", () => {
    test("should return a random value", () => {
      createUniqueSessionId();
      expect(v4).toHaveBeenCalled();
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
      saveGameState(startPosition, null, null);
      expect(setCookies).toHaveBeenCalledWith(
        "GameState",
        JSON.stringify(startPosition),
        expect.anything()
      );
    });
  });
});
