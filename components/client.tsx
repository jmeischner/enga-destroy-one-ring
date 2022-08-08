import type { NextPage } from 'next'

import styles from './styles/Client.module.css'
import Map from './map'

const Client = (): JSX.Element=> (
  <div className={styles.container}>
    Client Game 
    <Map />
 </div>
)

export default Client
