import { NextApiRequest, NextApiResponse } from "next";

interface Position {
  x: number
  y: number
}

interface grid {
  lines: Array<Array<string>>
}


export const newGame = (req: NextApiRequest, res: NextApiResponse): void => {
  res.status(200).json({ sessionId: 1234 });
}

export const getStartPosition = (): Position => {
  return {x: 0, y: 5}
}

export const gameGrid = (): grid => {
  const grid: grid = {
    lines: [
      getOneLine(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']),
      getOneLine(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']),
      getOneLine(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']),
      getOneLine(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']),
      getOneLine(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']),
      getOneLine(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']),
      getOneLine(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']),
      getOneLine(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']),
      getOneLine(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']),
      getOneLine(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'])
    ]
  }
  return grid
}

const getOneLine = (defVal: Array<string> | null): Array<string> => {
  const test: Array<string> = defVal != null ? createOneLine(defVal) : getRandomLine()
  return test
}

const createOneLine = (defVal: Array<string>): Array<string> => {
  return defVal
}

const getRandomLine = (): Array<string> => {
  return ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
}

const test = (): Position => {
  const check: Position
  return {x: 0, y: 0}
}

export default newGame
