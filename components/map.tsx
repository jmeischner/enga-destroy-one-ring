import { useEffect, useState, useCallback } from 'react'

import { MovementDirection, MovementResult } from 'components/interfaces/movement'

import { arraysEqual } from './helpers/arraysEqual'

import { UseMovementReturn } from 'hooks/useMovement'

import { api } from 'hooks/api'

import mapStyles from './styles/Map.module.css'

type Position = [number, number]

interface MapProps {
    movement: UseMovementReturn
    sessionId: string | null
}

interface PosField {
    pos: Position,
    field: MovementResult
}

const POS_START: Position = [0, 0]

const updateMapAndPosition = (direction: MovementDirection, field: MovementResult, currentPos: Position, knownMap: PosField[], setKnownMap: (map: PosField[]) => void): Position => {
    const directionMapper = {
        'n': [0, -1],
        'e': [1, 0],
        's': [0, 1],
        'w': [-1, 0],
    };

    const transition = directionMapper[direction];
    console.log(`currentPosition: ${currentPos}`)
    const pos: Position = [currentPos[0] + transition[0], currentPos[1] + transition[1]]
    let map = knownMap
    map.push({ pos, field })
    setKnownMap(map)
    return pos
}

const move = async (direction: MovementDirection, movement: UseMovementReturn, sessionId: string | null, currentPos: Position, knownMap: PosField[], setKnownMap:(map: PosField[]) => void, setCurrentPos: (pos: Position) => void): Promise<MovementState | undefined> => {
    if (movement.isLocked) {
        return
    }

    movement.setIsLocked(true)

    const response = await api.move(sessionId, direction)
    console.log(`response`, response)
    const movementResult = response.movementResult

    const newPosition = updateMapAndPosition(direction, movementResult, currentPos, knownMap, setKnownMap )
    console.log(`newPosition: ${newPosition}`)
    setCurrentPos(newPosition)
    switch (movementResult) {
        case 'path':
            movement.setIsLocked(false)
            return MovementState.Walking
        case 'slaughtered':
        case 'fallen':
            return MovementState.Dead
        case 'victory':
            return MovementState.Victory
    }
}

enum MovementState {
    Walking,
    Dead,
    Victory
}

const Map = ({ movement, sessionId }: MapProps): JSX.Element => {
    const [movementState, setMovementState] = useState<MovementState>(MovementState.Walking)
    const [currentPos, setCurrentPos] = useState(POS_START)
    const [knownMap, setKnownMap] = useState<PosField[]>([{ pos: POS_START, field: 'path' }])

    useEffect(() => {
        if (movement.direction) {
            move(movement.direction, movement, sessionId, currentPos, knownMap, setKnownMap, setCurrentPos).then(result => {
                if (result) setMovementState(result)
            })
        }
    }, [movement.direction])


    const getMapCrop = (): MovementResult[][] => {
        let fromX = currentPos[0] - 1;
        let toX = currentPos[0] + 1

        let fromY = currentPos[1] - 1
        let toY = currentPos[1] + 1


        let fields: MovementResult[][] = [];
        for (let y = fromY; y <= toY; y++) {
            let row: MovementResult[] = []
            for (let x = fromX; x <= toX; x++) {
                row.push(fieldOnPos([x, y]))
            }
            fields.push(row);
        }

        return fields;
    }

    const fieldOnPos = (pos: Position): MovementResult => {
        let field: MovementResult = 'fog'

        knownMap.forEach((val) => {
            if (arraysEqual(val.pos, pos))
                field = val.field
        })

        return field
    }

    const Map = (): JSX.Element => {
        const fields = getMapCrop()

        const eventMapper = {
            'fallen': mapStyles.fieldFallen,
            'slaughtered': mapStyles.fieldSlaughtered,
            'victory': mapStyles.fieldVictory,
            'fog': mapStyles.fieldFog,
            'path': mapStyles.fieldPath,
            'invalid': mapStyles.fieldFog
        }

        return (
            <table className={mapStyles.map} >
                <tbody>
                    {fields.map((row, i) =>
                        <tr key={i}>
                            {row.map((cell, j) => <td key={j} className={eventMapper[cell]} />)}
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }

    const displayGameState =(state: MovementState) => {
        switch (state) {
            case MovementState.Walking:
                return <div className={mapStyles.frodo} />
            case MovementState.Dead:
                return <div className={mapStyles.splash}><h2>Du bist tot!</h2></div>
            case MovementState.Victory:
                return <div className={mapStyles.splash}><h2>Ring zerstört</h2></div>
        }
    }

    return (
        <div className={mapStyles.mapContainer}>
            <Map />
            {
                displayGameState(movementState)
            }
        </div>
    )
}

export default Map
