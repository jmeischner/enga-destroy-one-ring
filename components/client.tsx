import { useEffect, useState } from 'react'

import useKeyPress from 'hooks/useKeyPress'

import styles from './styles/Client.module.css'
import Map from './map'

const POS_START = [0, 0]

const Client = (): JSX.Element=> {
  const [currentPos, setCurrentPos] = useState(POS_START)

  const [historyPos, setHistoryPos] = useState([POS_START])

  const anyPressed = useKeyPress()
  const wPressed = useKeyPress('w')
  const aPressed = useKeyPress('a')
  const sPressed = useKeyPress('s')
  const dPressed = useKeyPress('d')

  useEffect(() => {
    if (anyPressed) {
      console.log('anyPressed', anyPressed)
      console.log('wPressed', wPressed)
      console.log('aPressed', aPressed)
      console.log('sPressed', sPressed)
      console.log('dPressed', dPressed)
    }
  }, [anyPressed, wPressed, aPressed, sPressed, dPressed])

  return (
    <div className={styles.container}>
      Client Game 
      <Map />
    </div>
  )
}

export default Client
