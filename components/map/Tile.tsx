import { MovementResult } from "components/interfaces/movement";

import styles from "./Tile.module.css";

interface TileProps {
  type: MovementResult;
}

export const Tile = ({ type }: TileProps) => {
  const eventMapper = {
    fallen: styles.fieldFallen,
    slaughtered: styles.fieldSlaughtered,
    victory: styles.fieldVictory,
    fog: styles.fieldFog,
    path: styles.fieldPath,
    invalid: styles.fieldFog,
  };
  return <div className={`${styles.tile} + ${eventMapper[type]}`}></div>;
};
