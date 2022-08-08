import { useEffect, useState } from 'react'

import { MovementDirection } from 'components/interfaces/movement'

import useMovement from 'hooks/useMovement'

import styles from './styles/Client.module.css'

interface MapProps {
  afterMove: () => void
}

const POS_START = [0, 0]

const Map = ({ afterMove }: MapProps): JSX.Element => {
  const [currentPos, setCurrentPos] = useState(POS_START)
  const [historyPos, setHistoryPos] = useState([POS_START])

  const { direction, isLocked, setIsLocked } = useMovement()

  const move = (direction: MovementDirection) => {
    if (isLocked) {
      return
    }

    setIsLocked(true)
    console.log('move()', 'locked')
    console.log('move()', 'direction', direction)

    setTimeout(() => {
      setIsLocked(false)
      console.log('move()', 'unlocked')
    }, 2000)
  }

  useEffect(() => {
    if (direction) {
      move(direction)
    }
  }, [direction])

  return (
    <div className={styles.map}>
      Map
    </div>
  )
}

export default Map
