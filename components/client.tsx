import { useEffect, useState } from 'react'

import useApi from 'hooks/useApi'

import styles from './styles/Client.module.css'

import Map from './map'

const Client = (): JSX.Element => {
  const [sessionId, setSessionId] = useState<number>()

  const api = useApi()

  const newGame = () => {
    api.newGame()
      .then(response => setSessionId(response.id))
  }

  useEffect(newGame, [])

  const handleAfterMapMove = (): void => {}

  return (
    <div className={styles.container}>
      <p>Client Game</p>

      <p>Session: {sessionId ?? ''}</p>

      <Map
        afterMove={handleAfterMapMove}
      />
    </div>
  )
}

export default Client