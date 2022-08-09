export interface Movement {
  direction: MovementDirection
  event: MovementResult
}

export type MovementDirection = 'n' | 'e' | 's' | 'w'

export type MovementResult = 'Fallen' | 'Slaughtered' | 'Victory' | 'Path' | 'Fog' | 'Invalid'
