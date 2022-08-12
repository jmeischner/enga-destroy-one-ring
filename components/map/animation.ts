import { SpringRef } from "react-spring";
import { TILE_SHIFT } from "./Map";
import { Direction } from "./mapUtils";

export function animateDirectionChange(
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
