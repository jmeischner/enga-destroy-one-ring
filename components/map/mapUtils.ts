import { MovementResult } from "components/interfaces/movement";
import { Position } from "../../lib/server/newgame/newgame";

export type World = MapField[][];

export interface MapField {
  type: MovementResult;
}

export enum MovementState {
  Walking,
  Dead,
  Victory,
}

function newField(type: MovementResult = "fog"): MapField {
  return {
    type,
  };
}

type MoveResult = [Position, World];

export enum Direction {
  north = "n",
  east = "e",
  south = "s",
  west = "w",
}

function addRowTo(side: "start" | "end", map: World): World {
  const rowLength = map[0].length;
  const emptyRow = [];
  // new Array(rowLength).fill(newField()) is creating an array
  // where every item is the same reference. This means, changing
  // one type value in the row, is changing every type
  for (let i = 0; i < rowLength; i++) {
    emptyRow.push(newField());
  }
  if (side === "end") return [...map, emptyRow];
  else return [emptyRow, ...map];
}

function addColumnTo(side: "left" | "right", map: World): World {
  if (side === "left") {
    return map.map((row) => {
      return [newField(), ...row];
    });
  } else {
    return map.map((row) => {
      return [...row, newField()];
    });
  }
}

function addToMap(direction: Direction, map: World): World {
  switch (direction) {
    case Direction.north:
      return addRowTo("start", map);
    case Direction.south:
      return addRowTo("end", map);
    case Direction.west:
      return addColumnTo("left", map);
    case Direction.east:
      return addColumnTo("right", map);
  }
}

function movePosition(
  direction: Direction,
  currentPosition: Position
): Position {
  switch (direction) {
    case Direction.north:
      return new Position(currentPosition.x, currentPosition.y - 1);
    case Direction.south:
      return new Position(currentPosition.x, currentPosition.y + 1);
    case Direction.west:
      return new Position(currentPosition.x - 1, currentPosition.y);
    case Direction.east:
      return new Position(currentPosition.x + 1, currentPosition.y);
  }
}

function compensateMapAddition(
  direction: Direction,
  currentPosition: Position
) {
  switch (direction) {
    case Direction.north:
      return new Position(currentPosition.x, currentPosition.y + 1);
    case Direction.west:
      return new Position(currentPosition.x + 1, currentPosition.y);
    default:
      return currentPosition;
  }
}

export function getMovementState(type: MovementResult): MovementState {
  if (type === "fallen" || type === "slaughtered") return MovementState.Dead;
  if (type === "victory") return MovementState.Victory;
  return MovementState.Walking;
}

export function getInitialPosition() {
  return new Position(2, 2);
}

function cloneArray<T>(arr: T[][]): T[][] {
  let newArray: T[][] = [];
  for (let y of arr) {
    let row: T[] = [];
    for (let x of y) {
      row.push(x);
    }
    newArray.push(row);
  }
  return newArray;
}

function needToAddToMap(
  position: Position,
  map: World,
  isNecessary: () => void
) {
  if (
    position.x < 2 ||
    position.x >= map[0].length - 2 ||
    position.y < 2 ||
    position.y >= map.length - 2
  ) {
    isNecessary();
  }
}

export function moveInDirection(
  direction: Direction,
  currentPosition: Position,
  fieldType: MovementResult,
  map: World
): MoveResult {
  let newMap = cloneArray(map);
  let newPosition = movePosition(direction, currentPosition);
  needToAddToMap(newPosition, newMap, () => {
    newMap = addToMap(direction, newMap);
    newPosition = compensateMapAddition(direction, newPosition);
  });
  newMap[newPosition.y][newPosition.x].type = fieldType;

  return [newPosition, newMap];
}

export function getInitialMap(): World {
  return [
    [newField(), newField(), newField(), newField(), newField()],
    [newField(), newField(), newField(), newField(), newField()],
    [newField(), newField(), newField("path"), newField(), newField()],
    [newField(), newField(), newField(), newField(), newField()],
    [newField(), newField(), newField(), newField(), newField()],
  ];
}

export function getMapCrop(position: Position, map: World): World {
  const crop: World = [];

  const from = new Position(position.x - 2, position.y - 2);
  const to = new Position(position.x + 2, position.y + 2);

  for (let y = from.y; y <= to.y; y++) {
    const row: MapField[] = [];
    for (let x = from.x; x <= to.x; x++) {
      row.push(map[y][x]);
    }
    crop.push(row);
  }

  return crop;
}
