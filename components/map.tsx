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

const Map = ({ movement, sessionId }: MapProps): JSX.Element => {
    const [currentPos, setCurrentPos] = useState(POS_START)
    const [knownMap, setKnownMap] = useState<PosField[]>([{ pos: POS_START, field: 'Path' }])

    const updateMapAndPosition = useCallback((direction: MovementDirection, field: MovementResult) => {
        const directionMapper = {
            'n': [0, -1],
            'e': [1, 0],
            's': [0, 1],
            'w': [-1, 0],
        };

        const transition = directionMapper[direction];

        const pos: Position = [currentPos[0] + transition[0], currentPos[1] + transition[1]]
        let map = knownMap
        map.push({ pos, field })
        setKnownMap(map)

        setCurrentPos(pos)
    }, [])

    const move = useCallback(async (direction: MovementDirection) => {
        if (movement.isLocked) {
            return
        }

        movement.setIsLocked(true)
        console.log('move()', 'locked')
        console.log('move()', 'direction', direction)

        const response = await api.move(direction, sessionId)
        const movementResult = response.movementResult

        console.log({ movementResult })
        updateMapAndPosition(direction, movementResult)
        movement.setIsLocked(false)
        movement.setDirection(null)
    }, [])

    useEffect(() => {
        if (movement.direction) {
            move(movement.direction)
        }
    }, [movement.direction, move])

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
        let field: MovementResult = 'Fog'

        knownMap.forEach((val) => {
            if (arraysEqual(val.pos, pos))
                field = val.field
        })

        return field
    }

    const Map = (): JSX.Element => {
        const fields = getMapCrop()
        console.log({ fields })

        const eventMapper = {
            'Fallen': mapStyles.fieldFog,
            'Slaughtered': mapStyles.fieldFog,
            'Victory': mapStyles.fieldFog,
            'Fog': mapStyles.fieldFog,
            'Path': mapStyles.fieldPath,
            'Invalid': mapStyles.fieldFog
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

    return (
        <div className={mapStyles.mapContainer}>
            <Map />
            <div className={mapStyles.frodo} />
        </div>
    )
}

export default Map
