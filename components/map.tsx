import { useEffect, useState } from 'react'
import styles from './styles/Client.module.css'

const POS_START = [0, 0]

interface MapProps {
    afterMove: () => void,

}

const Map = (): JSX.Element => {
    const [currentPos, setCurrentPos] = useState(POS_START)
    const [historyPos, setHistoryPos] = useState([POS_START])
    return (
        <div className={styles.map}>
            Map
        </div>
    )
}
export default Client
