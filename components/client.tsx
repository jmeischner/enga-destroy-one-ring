import { useEffect, useState } from 'react'

import useApi from 'hooks/useApi'

import styles from './styles/Client.module.css'

import useMovement from 'hooks/useMovement'

import Map from './map'
import Buttons from './buttons'

const Client = (): JSX.Element => {
  const [sessionId, setSessionId] = useState<string>()

  const movement = useMovement()

  const api = useApi()

  const newGame = () => {
    api.newGame()
      .then(response => setSessionId(response.id))
  }

  useEffect(newGame, [])

  return (
    <div className={styles.container}>
      <p>Client Game</p>

      <Map movement={movement} />

      <Buttons movement={movement} />
    </div>
  )
}

export default Client
