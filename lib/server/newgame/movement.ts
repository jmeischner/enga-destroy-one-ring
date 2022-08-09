import {getCookie} from "cookies-next";
import {NextApiRequest} from "next";
import {COOKIE, GameState, Position} from "./newgame";


export interface Movement {
    direction: MovementDirection
    event: MovementResult
  }
  
export type MovementDirection = 'n' | 'e' | 's' | 'w'
  
export type MovementResult = 'fallen' | 'slaughtered' | 'victory' | 'path' | 'invalid'

export const gameGrid: MovementResult[][] = [
    ['path', 'path', 'path', 'slaughtered', 'path', 'path', 'path', 'path', 'path', 'path', 'path'],
    ['path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'victory', 'path', 'path'],
    ['path', 'path', 'path', 'path', 'path', 'path', 'slaughtered', 'path', 'path', 'path', 'path'],
    ['path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path'],
    ['path', 'path', 'path', 'path', 'path', 'slaughtered', 'path', 'path', 'path', 'path', 'path'],
    ['path', 'slaughtered', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path'],
    ['path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path'],
    ['path', 'path', 'path', 'path', 'path', 'slaughtered', 'path', 'path', 'slaughtered', 'path', 'path'],
    ['path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path'],
    ['path', 'path', 'path', 'slaughtered', 'path', 'path', 'path', 'path', 'path', 'path', 'path']
]

export const getCurrentGameState = (req: NextApiRequest): GameState => {
    const gamestateAsString: string = getCookie(COOKIE) as string
    return JSON.parse(gamestateAsString)
  };

export const checkNewPosition = (pos: Position): MovementResult => {
    if ((pos.y >= gameGrid.length  || pos.y < 0) || (pos.x >= gameGrid.length || pos.x < 0)){
        return 'fallen'
    } 
    const checkGrid: MovementResult = gameGrid[pos.y][pos.x]
    return checkGrid
}

export const calculateNewPosition = (gamestate: GameState, req: NextApiRequest ): Position => {
    //get active position
    const activePosition: Position = gamestate.position
    // get movement from request
    const moveDirection: MovementDirection = req.body.direction
    //move to new position
    if (moveDirection === 'n') {
        return new Position(activePosition.x, activePosition.y - 1);
    }
    if (moveDirection === 's') {
        return new Position(activePosition.x, activePosition.y + 1);
    }
    if (moveDirection === 'e') {
        return new Position(activePosition.x + 1, activePosition.y);
    }
    if (moveDirection === 'w') {
        return new Position(activePosition.x - 1, activePosition.y);
    }
    //status invalid nothing happened wrong key
    return new Position(activePosition.x, activePosition.y);
}

export const isGameAlreadyFinished = (gamestate: GameState): boolean  => {
    return (gamestate.state != 'path' && gamestate.state != 'invalid')
}