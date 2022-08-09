import { useEffect, useState } from 'react'

import { Movement, MovementDirection, MovementResult } from 'components/interfaces/movement'

import { arraysEqual } from './helpers/arraysEqual'

import useMovement from 'hooks/useMovement'

import { api } from 'hooks/api'

import mapStyles from './styles/Map.module.css'
import internal from 'stream'

type Position = [number, number]
interface MapProps {
    afterMove: () => void
}
interface PosField {
    pos: Position,
    field: MovementResult
}

const POS_START: Position = [0, 0]

const Map = ({ afterMove }: MapProps): JSX.Element => {
    const [isWalking, setIsWalking] = useState(true)
    const [showDeathScreen, setShowDeathScreen] = useState(false)
    const [showVictoryScreen, setShowVictoryScreen] = useState(false)
    const [currentPos, setCurrentPos] = useState(POS_START)
    const [knownMap, setKnownMap] = useState<PosField[]>([{ pos: POS_START, field: 'Path' }])
    const { direction, isLocked, setIsLocked } = useMovement()

    const updateMapAndPosition = (direction: MovementDirection, field: MovementResult) => {
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
    }

    const move = async (direction: MovementDirection) => {
        if (isLocked) {
            return
        }

        setIsLocked(true)

        const response = await api.move(direction)
        const movementResult = response.movementResult

        updateMapAndPosition(direction, movementResult)
        switch (movementResult) {
            case 'Path':
                setIsLocked(false)
                break;
            case 'Slaughtered':
            case 'Fallen':
                setIsWalking(false)
                setShowDeathScreen(true);
                console.log('show death screen')
                break;
            case 'Victory':
                setIsWalking(false)
                setShowVictoryScreen(true);
                break;
        }
    }

    useEffect(() => {
        if (direction) {
            move(direction)
        }
    }, [direction])


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
            'Fallen': mapStyles.fieldFallen,
            'Slaughtered': mapStyles.fieldSlaughtered,
            'Victory': mapStyles.fieldVictory,
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
            {isWalking && (<div className={mapStyles.frodo} />)}
            {showDeathScreen && (<div className={mapStyles.splash}><h2>Du bist tot!</h2></div>)}
            {showVictoryScreen && (<div className={mapStyles.splash}><h2>Ring zerstört</h2></div>)}
        </div>
    )
}

export default Map
