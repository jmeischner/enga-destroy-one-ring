import { useState, useEffect } from 'react'

export const useKeyPress = (targetKey?: string) => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false)

  const handleKeyDown = ({ key }: KeyboardEvent) => {
    if (!targetKey || key === targetKey) {
      setKeyPressed(true)
    }
  }

  const handleKeyUp = ({ key }: KeyboardEvent) => {
    if (!targetKey || key === targetKey) {
      setKeyPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keyPressed
}

export default useKeyPress
