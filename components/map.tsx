import { useEffect, useState } from 'react'

import { MovementDirection, MovementResult } from 'components/interfaces/movement'

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
    const [currentPos, setCurrentPos] = useState(POS_START)
    const [knownMap, setKnownMap] = useState<PosField[]>([{ pos: POS_START, field: 'path' }])

    const { direction, isLocked, setIsLocked } = useMovement()

    const move = async (direction: MovementDirection) => {
        if (isLocked) {
            return
        }

        setIsLocked(true)
        console.log('move()', 'locked')
        console.log('move()', 'direction', direction)

        const response = await api.move(direction)

        console.log({response})
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
