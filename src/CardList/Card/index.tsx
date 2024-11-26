import styles from './Card.module.scss';
import { FC, useContext, useEffect, useRef, useState } from "react";
import { Habbit } from "../../repositories/habbit-repository";
import cx from 'classnames';
import { celebrationContext } from '../../Celebration';
type Props = {
    habbit: Habbit;
}
type TimerReturn = ReturnType<typeof setTimeout>;

export const Card: FC<Props> = ({ habbit: { name, iteration, goal } }) => {
    const {setShowCelebrate} = useContext(celebrationContext);
    const [isFilling, setIsFilling] = useState<boolean>(false);
    const timerRef = useRef<TimerReturn | null>(null);

    const mouseDownHandler = () => {
        setIsFilling(true);
    }
    const mouseUpHandler = () => {
        setIsFilling(false);
        timerRef.current && clearTimeout(timerRef.current);
    }
    useEffect(() => {
        timerRef.current = setTimeout(() => {
            setShowCelebrate(true);
        }, 1200);
    }, [isFilling])
    return <li
        onMouseDown={mouseDownHandler}
        onTouchStart={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onTouchEnd={mouseUpHandler}
        onMouseOut={mouseUpHandler}
        className={cx(styles.card)}>
        <div className={cx(styles.inner,  isFilling && styles.filling)}>
            <h2>{name}</h2>
            <div className={styles.copy}>
                {/* TODO: Add "Last Updated" */}
                <p className={styles.numbersCopy}>
                    <strong>Followed through on:</strong>
                </p>
                <p className={styles.numbers}>{iteration}/{goal}</p>
            </div>
        </div>
    </li>;
} 