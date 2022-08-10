import {
  Direction,
  getInitialMap,
  getInitialPosition,
  getMapCrop,
  moveInDirection,
} from "./mapUtils";

describe("getInitialMap", () => {
  test("should return a 5x5 map", () => {
    const initialMap = getInitialMap();
    expect(initialMap).toHaveLength(5);
    initialMap.forEach((row) => {
      expect(row).toHaveLength(5);
    });
  });

  test("an open 'path' field should be in the middle", () => {
    const initialMap = getInitialMap();
    const midIndex = Math.floor(initialMap.length / 2);
    const midField = initialMap[midIndex][midIndex];
    expect(midField.type).toBe("path");
  });
});

describe("moveInDirection", () => {
  test("should add a row to the beginning when direction is north", () => {
    const map = getInitialMap();
    const [newPosition, newMap] = moveInDirection(
      Direction.north,
      { x: 2, y: 2 },
      "path",
      map
    );
    expect(newMap).toHaveLength(6);
    newMap.forEach((row) => {
      expect(row).toHaveLength(5);
    });
    expect(newPosition).toEqual({ x: 2, y: 2 });
  });

  test("should add a row to the end when direction is south", () => {
    const map = getInitialMap();
    const [newPosition, newMap] = moveInDirection(
      Direction.south,
      { x: 2, y: 2 },
      "path",
      map
    );
    expect(newMap).toHaveLength(6);
    newMap.forEach((row) => {
      expect(row).toHaveLength(5);
    });
    expect(newPosition).toEqual({ x: 2, y: 3 });
  });

  test("should add a new column to the end if direction is east", () => {
    const map = getInitialMap();
    const [newPosition, newMap] = moveInDirection(
      Direction.east,
      { x: 2, y: 2 },
      "path",
      map
    );
    expect(newMap).toHaveLength(5);
    newMap.forEach((row) => {
      expect(row).toHaveLength(6);
    });
    expect(newPosition).toEqual({ x: 3, y: 2 });
  });

  test("should add a new column to the beginning if direction is west", () => {
    const map = getInitialMap();
    const [newPosition, newMap] = moveInDirection(
      Direction.west,
      { x: 2, y: 2 },
      "path",
      map
    );
    expect(newMap).toHaveLength(5);
    newMap.forEach((row) => {
      expect(row).toHaveLength(6);
    });
    expect(newPosition).toEqual({ x: 2, y: 2 });
  });
});

describe("getMapCrop", () => {
  test("should return a crop of 5x5 of a given map", () => {
    const map = getInitialMap();
    const [position, newMap] = moveInDirection(
      Direction.east,
      getInitialPosition(),
      "path",
      map
    );
    expect(newMap[2][1].type).toBe("fog");
    expect(newMap[2][2].type).toBe("path");
    expect(newMap[2][3].type).toBe("path");
    expect(newMap[2][4].type).toBe("fog");

    const crop = getMapCrop(position, newMap);
    expect(crop).toHaveLength(5);
    crop.forEach((row) => {
      expect(row).toHaveLength(5);
    });
    expect(crop[2][1].type).toBe("path");
    expect(crop[2][2].type).toBe("path");
    expect(crop[2][3].type).toBe("fog");
  });
});
