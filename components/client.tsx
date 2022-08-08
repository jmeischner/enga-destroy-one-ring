import { useEffect, useState } from 'react'

import { Movement } from 'components/interfaces/movement'
import useMovement from 'hooks/useMovement'

import styles from './styles/Client.module.css'
import Map from './map'

const Client = (): JSX.Element=> {
  const handleAfterMapMove = (): void => {
    setIsLocked(false)
  }

  const apiCall = async (): Promise<Movement> => {
    return Promise.resolve({
      direction: 'w',
      event: 'invalid'
    })
  }

  return (
    <div className={styles.container}>
      <p>Client Game</p>

      <Map
        afterMove={handleAfterMapMove}
      />
    </div>
  )
}

export default Client
