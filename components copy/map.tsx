import { useEffect, useState } from 'react'

import useMovement from 'hooks/useMovement'

import styles from './styles/Client.module.css'

interface MapProps {
  afterMove: () => void
}

const Map = ({ afterMove }: MapProps): JSX.Element => {
  const { direction, isLocked, setIsLocked } = useMovement()

  useEffect(() => {
    if (direction) {
      setIsLocked(true)

      setTimeout(() => {
        setIsLocked(false)
      }, 2000)

      console.log('direction', direction)
    }
  }, [direction, setIsLocked])

  return (
    <div className={styles.map}>
      Map
    </div>
  )
}

export default Map
