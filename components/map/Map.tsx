import { useEffect, useState } from "react";

import { Tile } from "./Tile";
import { Frodo } from "./Frodo";
import {
  Direction,
  getInitialMap,
  getInitialPosition,
  getMapCrop,
  moveInDirection,
} from "./mapUtils";

import styles from "./Map.module.css";

import type { World } from "./mapUtils";
import { Position } from "lib/server/newgame/newgame";
import { useKeyPress } from "./useKeyPress";
import { api } from "./api";

interface MapProps {
  readonly sessionId: string | null;
}

interface GameState {
  readonly position: Position;
  readonly map: World;
}

function getInitialGameState() {
  return {
    position: getInitialPosition(),
    map: getInitialMap(),
  };
}

enum MovementState {
  Walking,
  Dead,
  Victory,
}

export const Map = ({ sessionId }: MapProps) => {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [map, setMap] = useState<World | null>(null);
  const goInDirection = async (direction: Direction) => {
    const result = await api.move(sessionId, direction);
    const [newPosition, newMap] = moveInDirection(
      direction,
      gameState.position,
      result.movementResult,
      gameState.map
    );
    setGameState({
      position: newPosition,
      map: newMap,
    });
  };

  useEffect(() => {
    const mapCrop = getMapCrop(gameState.position, gameState.map);
    console.log(mapCrop);
    setMap(mapCrop);
  }, [gameState]);

  const ref = useKeyPress<HTMLDivElement>({
    keys: [
      {
        targetKey: "a",
        onKeyPress: () => goInDirection(Direction.west),
      },
      {
        targetKey: "d",
        onKeyPress: () => goInDirection(Direction.east),
      },
      {
        targetKey: "s",
        onKeyPress: () => goInDirection(Direction.south),
      },
      {
        targetKey: "w",
        onKeyPress: () => goInDirection(Direction.north),
      },
    ],
  });

  return (
    <div ref={ref} className={styles.mapContainer}>
      <div className={styles["visible-map"]}>
        {map &&
          map.map((row, i) => (
            <div className={styles.row} key={i}>
              {row.map((cell, j) => (
                <Tile key={`${i}-${j}`} type={cell.type} />
              ))}
            </div>
          ))}
      </div>
      <Frodo />
    </div>
  );
};
