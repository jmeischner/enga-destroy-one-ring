import { useEffect, useState } from 'react'

import useApi from 'hooks/useApi'

import styles from './styles/Client.module.css'

import Map from './map'

const Client = (): JSX.Element => {
  const [sessionId, setSessionId] = useState<string>()

  const api = useApi()

  const newGame = () => {
    api.newGame()
      .then(response => setSessionId(response.id))
  }

  useEffect(newGame, [])

  const handleAfterMapMove = (): void => {}

  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>Destroy one ring</h1>

      <p className={styles.sessionid}>Session: {sessionId ?? ''}</p>

      <Map
        afterMove={handleAfterMapMove}
      />
    </div>
  )
}

export default Client
