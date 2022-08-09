import { useState, useEffect, Dispatch, SetStateAction } from 'react'

import { MovementDirection } from 'components/interfaces/movement'

import useKeyPress from './useKeyPress'

export interface UseMovementReturn {
  direction: MovementDirection | null
  isLocked: boolean
  setIsLocked: Dispatch<SetStateAction<boolean>>
  setDirection: Dispatch<SetStateAction<MovementDirection | null>>
}

export const useMovement = (): UseMovementReturn => {
  const [isLocked, setIsLocked] = useState<boolean>(false)

  const [direction, setDirection] = useState<MovementDirection | null>(null)

  const anyPressed = useKeyPress()

  const wPressed = useKeyPress('w')
  const aPressed = useKeyPress('a')
  const sPressed = useKeyPress('s')
  const dPressed = useKeyPress('d')

  useEffect(() => {
    if (anyPressed || isLocked) {
      return
    }

    if (wPressed) {
      setDirection('n')
    } else if (aPressed) {
      setDirection('w')
    } else if (sPressed) {
      setDirection('s')
    } else if (dPressed) {
      setDirection('e')
    }
  }, [isLocked, anyPressed, wPressed, aPressed, sPressed, dPressed])

  return {
    direction,
    isLocked,
    setIsLocked,
    setDirection
  }
}

export default useMovement
