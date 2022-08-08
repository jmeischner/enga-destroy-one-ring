import { MovementDirection } from 'components/interfaces/movement'

const basePath = 'http://localhost:3000/api/'

/*
export const useApi = <T>(path: string): () => Promise<T> => {
  const execute = (): Promise<T> => {
    return new Promise((resolve, reject) => {
      fetch(`${basePath}${path}`)
      .then(async (res: Response) => await res.json())
      .then(json => {
        resolve(json as T)
      })
      .catch(reject)
    })
  }

  return execute
}
*/

/*
export const useApi = <T>(path: string): () => Promise<T> => {
  const execute = (): Promise<T> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('API-CALL: newgame')
        resolve(324324 as unknown as T)
      }, 2000)
    })
  }

  return execute
}
*/

interface ApiResponseNewGame {
  id: number
}

interface ApiResponseMove {}

type ApiExecuteFunction<T> = (...args: any[]) => Promise<T>

interface ApiFunctions {
  newGame: ApiExecuteFunction<ApiResponseNewGame>
  move: ApiExecuteFunction<ApiResponseMove>
}

const execute = <T>(path: string, method: string, data?: Record<string, unknown>): Promise<T> => {
  return new Promise((resolve, reject) => {
    fetch(
      `${basePath}${path}`,
      {
        method: method.toUpperCase(),
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: !['GET', 'HEAD'].includes(method.toUpperCase()) ? JSON.stringify(typeof data === 'object' ? data : {}) : undefined
      }
    )
    .then(async (res: Response) => await res.json())
    .then(json => {
      resolve(json)
    })
    .catch(reject)
  })
}

export const useApi = (): ApiFunctions => {
  return {
    newGame: () => execute<ApiResponseNewGame>('newgame', 'POST', { asdasd: 'sdfsdf' }),
    move: (direction: MovementDirection) => execute<ApiResponseMove>('move', 'POST', { direction })
  }
}

export default useApi
