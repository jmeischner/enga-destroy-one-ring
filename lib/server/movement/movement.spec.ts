import { GameState, Position, saveGameState } from "./../newgame/newgame";
import {
  calculateNewPosition,
  checkNewPosition,
  isGameAlreadyFinished,
} from "./movement";
import * as cookies from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

jest.mock("cookies-next", () => {
  return {
    getCookie: jest.fn(),
  };
});

describe("movement", () => {
  test("should return a movement Result", () => {
    const pos: Position = new Position(0, 5);
    const newPosition = calculateNewPosition(pos, "n");
    const result = checkNewPosition(newPosition);
    expect(result).toBe("path");
  });
});

describe("calculateNewPosition", () => {
  test("should decrease y when direction is 'n'", () => {
    const newPosition = calculateNewPosition({ x: 5, y: 3 }, "n");
    expect(newPosition).toEqual({ x: 5, y: 2 });
  });
  test("should decrease x when direction is 'w'", () => {
    const newPosition = calculateNewPosition({ x: 5, y: 3 }, "w");
    expect(newPosition).toEqual({ x: 4, y: 3 });
  });
  test("should increase x when direction is 'e'", () => {
    const newPosition = calculateNewPosition({ x: 5, y: 3 }, "e");
    expect(newPosition).toEqual({ x: 6, y: 3 });
  });
  test("should increase y when direction is 's'", () => {
    const newPosition = calculateNewPosition({ x: 5, y: 3 }, "s");
    expect(newPosition).toEqual({ x: 5, y: 4 });
  });
});

describe("checkNewPosition", () => {
  test("should return path", () => {
    const pos: Position = new Position(0, 5);
    expect(checkNewPosition(pos)).toBe("path");
  });
  test("should return fallen when position is outside array boundaries", () => {
    const pos: Position = new Position(0, -1);
    expect(checkNewPosition(pos)).toBe("fallen");
  });
  test("should return slaughthered when there is an Orc", () => {
    const pos: Position = new Position(3, 0);
    expect(checkNewPosition(pos)).toBe("slaughtered");
  });
  test("should return victory when Schicksalsberg", () => {
    const pos: Position = new Position(8, 1);
    expect(checkNewPosition(pos)).toBe("victory");
  });
});

describe("isGameAlreadyFinished", () => {
  test("should check if game is already finished", () => {
    const pos: Position = new Position(0, 5);
    const testGameState: GameState = {
      position: pos,
      sessionId: "42",
      state: "path",
    };
    expect(isGameAlreadyFinished(testGameState)).toBeFalsy();
  });
});
