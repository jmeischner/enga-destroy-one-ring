import { useEffect, useState } from "react";

import { api } from "./api";

import styles from "./styles/Client.module.css";

import { Map } from "./map";

const Client = (): JSX.Element => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const newGame = () => {
    api.newGame().then((response) => setSessionId(response.id));
  };

  useEffect(newGame, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>Destroy one ring</h1>

      <Map sessionId={sessionId} />
    </div>
  );
};

export default Client;
