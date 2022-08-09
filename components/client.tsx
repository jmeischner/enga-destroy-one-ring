import { useEffect, useState } from 'react'

import { api } from 'hooks/api'

import styles from './styles/Client.module.css'

import useMovement from 'hooks/useMovement'

import Map from './map'
import Buttons from './buttons'

const Client = (): JSX.Element => {
  const [sessionId, setSessionId] = useState<string |null>(null)

  const movement = useMovement()

  const newGame = () => {
    api.newGame()
      .then(response => setSessionId(response.id))
  }

  useEffect(newGame, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>Destroy one ring</h1>

      <Map movement={movement} sessionId={sessionId} />
      
      <Buttons movement={movement} />
    </div>
  )
}

export default Client
