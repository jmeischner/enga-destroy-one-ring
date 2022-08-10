import { useCallback, useEffect, useState } from "react";

import { Tile } from "./Tile";
import { Frodo } from "./Frodo";
import {
  Direction,
  getInitialMap,
  getInitialPosition,
  getMapCrop,
  getMovementState,
  moveInDirection,
  MovementState,
} from "./mapUtils";

import styles from "./Map.module.css";

import type { World } from "./mapUtils";
import { Position } from "lib/server/newgame/newgame";
import { useKeyPress } from "./useKeyPress";
import { api } from "../api";
import { GameEnd } from "./GameEnd";
import { Victory } from "./Victory";
import { animated, SpringRef, useSpring } from "react-spring";

const TILE_SHIFT = 226;

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

function animateTo(
  margin: "marginTop" | "marginBottom" | "marginLeft" | "marginRight"
) {
  const getToObject = (value: string) => {
    let to: any = {};
    to[margin] = value;
    return to;
  };
  const animationToValue =
    margin === "marginTop" || margin === "marginLeft"
      ? "0"
      : `-${2 * TILE_SHIFT}px`;
  return {
    to: async (next: any) => {
      await next({
        to: getToObject(animationToValue),
        config: { duration: undefined },
      });
      await next({
        to: getToObject(`-${TILE_SHIFT}px`),
        config: { duration: 0 },
      });
    },
  };
}

function animateDirectionChange(
  direction: Direction,
  animation: SpringRef<any>
) {
  return new Promise((resolve) => {
    switch (direction) {
      case Direction.east:
        animation.start({
          to: async (next: any) => {
            await next({
              to: { marginLeft: `-${2 * TILE_SHIFT}px` },
              config: { duration: undefined },
            });
            await next({
              to: { marginLeft: `-${TILE_SHIFT}px` },
              config: { duration: 0 },
            });
            resolve(true);
          },
        });
        break;
      case Direction.west:
        animation.start({
          to: async (next: any) => {
            await next({
              to: { marginLeft: `0` },
              config: { duration: undefined },
            });
            await next({
              to: { marginLeft: `-${TILE_SHIFT}px` },
              config: { duration: 0 },
            });
            resolve(true);
          },
        });
        break;
      case Direction.north:
        animation.start({
          to: async (next: any) => {
            await next({
              to: { marginTop: `0` },
              config: { duration: undefined },
            });
            await next({
              to: { marginTop: `-${TILE_SHIFT}px` },
              config: { duration: 0 },
            });
            resolve(true);
          },
        });
        break;
      case Direction.south:
        animation.start({
          to: async (next: any) => {
            await next({
              to: { marginTop: `-${2 * TILE_SHIFT}px` },
              config: { duration: undefined },
            });
            await next({
              to: { marginTop: `-${TILE_SHIFT}px` },
              config: { duration: 0 },
            });
            resolve(true);
          },
        });
        break;
    }
  });
}

export const Map = ({ sessionId }: MapProps) => {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [movementState, setMovementState] = useState<MovementState>(
    MovementState.Walking
  );
  const [lock, setLock] = useState(false);
  const [map, setMap] = useState<World | null>(
    getMapCrop(gameState.position, gameState.map)
  );
  const [animationStyles, animation] = useSpring(() => ({
    marginTop: `-${TILE_SHIFT}px`,
    marginLeft: `-${TILE_SHIFT}px`,
    marginBottom: `-${TILE_SHIFT}px`,
    marginRight: `-${TILE_SHIFT}px`,
  }));

  async function goInDirection(direction: Direction) {
    if (!lock) {
      setLock(true);
      const result = await api.move(sessionId, direction);
      await animateDirectionChange(direction, animation);
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
      setMovementState(getMovementState(result.movementResult));
      setMap(getMapCrop(newPosition, newMap));
      setLock(false);
    }
  }
  useKeyPress({
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

  const displayGameState = (state: MovementState) => {
    switch (state) {
      case MovementState.Walking:
        return <Frodo />;
      case MovementState.Dead:
        return <GameEnd />;
      case MovementState.Victory:
        return <Victory />;
    }
  };

  return (
    <div className={styles.mapContainer}>
      <animated.div className={styles["visible-map"]} style={animationStyles}>
        {map &&
          map.map((row, i) => (
            <div className={styles.row} key={i}>
              {row.map((cell, j) => (
                <Tile key={`${i}-${j}`} type={cell.type} />
              ))}
            </div>
          ))}
      </animated.div>
      {displayGameState(movementState)}
    </div>
  );
};
