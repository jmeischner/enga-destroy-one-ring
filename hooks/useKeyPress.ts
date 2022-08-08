import { useState, useEffect } from 'react'

export const useKeyPress = (targetKey?: string) => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false)

  const downHandler = ({ key }: KeyboardEvent) => {
    if (!targetKey || key === targetKey) {
      setKeyPressed(true)
    }
  }

  const upHandler = ({ key }: KeyboardEvent) => {
    if (!targetKey || key === targetKey) {
      setKeyPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [])

  return keyPressed
}

export default useKeyPress
