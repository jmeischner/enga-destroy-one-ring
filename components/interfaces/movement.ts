export interface Movement {
  direction: MovementDirection
  event: MovementResult
}

export type MovementDirection = 'n' | 'e' | 's' | 'w'

export type MovementResult = 'fallen' | 'slaughtered' | 'victory' | 'path' | 'invalid'
