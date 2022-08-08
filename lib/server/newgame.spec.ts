import {
  COOKIE,
  createUniqueSessionId,
  getStartPosition,
  Position,
  saveGameState,
} from "./newgame";

import * as uuid from "uuid";
import * as cookies from "cookies-next";

// const mockV4 = jest.fn();
// const mockSetCookies = jest.fn();

jest.mock("uuid", () => {
  return {
    v4: jest.fn(),
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
      expect(uuid.v4).toHaveBeenCalled();
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
      const testGameState = {position: startPosition, sessionId: '42'}
      saveGameState(testGameState, {}, {});
      expect(cookies.setCookie).toHaveBeenCalledWith(
        COOKIE,
        testGameState,
        expect.anything()
      );
    });
  });
});
