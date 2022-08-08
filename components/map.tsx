import { useEffect, useState } from 'react'

import { MovementDirection, MovementResult } from 'components/interfaces/movement'

import { arraysEqual } from './helpers/arraysEqual'

import useMovement from 'hooks/useMovement'

import styles from './styles/Map.module.css'
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

    const move = (direction: MovementDirection) => {
        if (isLocked) {
            return
        }

        setIsLocked(true)
        console.log('move()', 'locked')
        console.log('move()', 'direction', direction)

        setTimeout(() => {
            setIsLocked(false)
            console.log('move()', 'unlocked')
        }, 2000)
    }

    useEffect(() => {
        if (direction) {
            move(direction)
        }
    }, [direction])


    const getMapCrop = (animateDirection: MovementDirection | null): MovementResult[][] => {
        let fromX = currentPos[0] - 1;
        let toX = currentPos[0] + 1

        let fromY = currentPos[1] - 1
        let toY = currentPos[1] + 1


        switch (animateDirection) {
            case 'n':
                fromY--;
                break;
            case 'e':
                fromX++;
                break;
            case 's':
                fromY++;
                break;
            case 'w':
                fromX--;
                break;
        }

        let fields: MovementResult[][] = [];
        for (let x = fromX; x <= toX; x++) {
            let row: MovementResult[] = []
            for (let y = fromY; y <= toY; y++) {
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

    const Fields = ({animateDirection}: { animateDirection: MovementDirection|null}): JSX.Element => {
        const fields = getMapCrop(animateDirection)

        const eventMapper = {
            'fallen': styles.fieldFog,
            'slaughtered': styles.fieldFog,
            'victory': styles.fieldFog,
            'fog': styles.fieldFog,
            'path': styles.fieldPath,
            'invalid': styles.fieldFog
        }

        return (
            <table className={styles.map}>
                {fields.map((row, i) =>
                    <tr key={i}>
                        {row.map((cell, j) => <td key={j} className={eventMapper[cell]} />)}
                    </tr>)}
            </table>
        )
    }

    return (
        <div className={styles.mapContainer}>
            <Fields animateDirection={direction} />
            <div className={styles.frodo} />
        </div>
    )
}

export default Map
