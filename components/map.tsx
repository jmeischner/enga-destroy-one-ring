import { useEffect, useState } from 'react'

import { MovementDirection, MovementResult } from 'components/interfaces/movement'

import { arraysEqual } from './helpers/arraysEqual'

import useMovement from 'hooks/useMovement'

import mapStyles from './styles/Map.module.css'
import internal from 'stream'
import { useSpring } from 'react-spring'

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


    const getMapCropAndAnimation = (animateDirection: MovementDirection | null): {
        fields: MovementResult[][],
        springObject: Object
    } => {
        let fromX = currentPos[0] - 1;
        let toX = currentPos[0] + 1

        let fromY = currentPos[1] - 1
        let toY = currentPos[1] + 1

        let springObject = {}

        switch (animateDirection) {
            case 'n':
                fromY--;
                break;
            case 'e':
                toX++;
                break;
            case 's':
                toY++;
                break;
            case 'w':
                fromX--;
                break;
        }

        let fields: MovementResult[][] = [];
        for (let y = fromY; y <= toY; y++) {
            let row: MovementResult[] = []
            for (let x = fromX; x <= toX; x++) {
                row.push(fieldOnPos([x, y]))
            }
            fields.push(row);
        }

        return {fields, springObject};
    }

    const fieldOnPos = (pos: Position): MovementResult => {
        let field: MovementResult = 'fog'

        knownMap.forEach((val) => {
            if (arraysEqual(val.pos, pos))
                field = val.field
        })

        return field
    }

    const Map = ({ animateDirection }: { animateDirection: MovementDirection | null }): JSX.Element => {
        const {fields, springObject} = getMapCropAndAnimation(animateDirection)
        const styles = useSpring(springObject)

        const eventMapper = {
            'fallen': mapStyles.fieldFog,
            'slaughtered': mapStyles.fieldFog,
            'victory': mapStyles.fieldFog,
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

    return (
        <div className={mapStyles.mapContainer}>
            <Map animateDirection={direction} />
            <div className={mapStyles.frodo} />
        </div>
    )
}

export default Map
