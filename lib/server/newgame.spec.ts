import {
  createUniqueSessionId,
  getStartPosition,
  Position,
  saveGameState,
} from "./newgame";

import * as uuid from "uuid";
import * as cookies from "cookies-next";

const mockV4 = jest.fn();
const mockSetCookies = jest.fn();

jest.mock("uuid", () => {
  return {
    v4: mockV4,
  };
});

jest.mock("cookies-next", () => {
  return {
    setCookies: mockSetCookies,
  };
});

describe("newGame's", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("createUniqueSessionId", () => {
    test("should return a random value", () => {
      createUniqueSessionId();
      expect(mockV4).toHaveBeenCalled();
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
      expect(mockSetCookies).toHaveBeenCalledWith(
        "GameState",
        JSON.stringify(startPosition),
        expect.anything()
      );
    });
  });
});
