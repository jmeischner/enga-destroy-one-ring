import styles from './styles/Buttons.module.css'

import { MovementDirection } from 'components/interfaces/movement'

import { UseMovementReturn } from 'hooks/useMovement'

interface ButtonsProps {
  movement: UseMovementReturn
}

const Buttons = ({ movement }: ButtonsProps): JSX.Element => {
  const handleClick = (direction: MovementDirection) => (
    () => {
      movement.setDirection(direction)
    }
  )

  return (
    <div className={styles.buttons}>
      <button onClick={handleClick('n')}>top</button>
      <br/>
      <button onClick={handleClick('w')}>left</button>
      <button onClick={handleClick('e')}>right</button>
      <br/>
      <button onClick={handleClick('s')}>bottom</button>
    </div>
  )
}

export default Buttons
