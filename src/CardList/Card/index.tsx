import styles from './Card.module.scss';
import { FC, useContext, useEffect, useRef, useState } from "react";
import { habit, incrementHbbit } from "../../repositories/habit-repository";
import cx from 'classnames';
import { celebrationContext } from '../../Celebration';
import dayjs from 'dayjs';
type Props = {
    habit: habit;
    updateCards: () => Promise<void>;
}
type TimerReturn = ReturnType<typeof setTimeout>;

export const Card: FC<Props> = ({ habit: { id, name, iteration, goal, lastUpdated }, updateCards }) => {
    const { setShowCelebrate } = useContext(celebrationContext);
    const [isFilling, setIsFilling] = useState<boolean>(false);
    const [disabled, setDisabled] = useState(false);
    const timerRef = useRef<TimerReturn | null>(null);
    useEffect(() => {
        if (lastUpdated) {
            const date = dayjs(lastUpdated);
            const now = dayjs().subtract(1, 'day');
            if (date.isAfter(now)) {
                setDisabled(true);
            };
        }
    }, [iteration]);

    const mouseDownHandler = () => {
        !disabled && setIsFilling(true);
        console.log({ disabled });
        if (!disabled) {
            timerRef.current = setTimeout(async () => {
                setShowCelebrate(true);
                // setDisabled(true);
                await incrementHbbit(id, iteration);
                await updateCards();
            }, 1200);
        }
    }
    const mouseUpHandler = () => {
        setIsFilling(false);
        timerRef.current && clearTimeout(timerRef.current);
    }
    return <li
        onMouseDown={mouseDownHandler}
        onTouchStart={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onTouchEnd={mouseUpHandler}
        onMouseOut={mouseUpHandler}
        className={cx(styles.card, disabled && styles.doneForDay)}>
        <div className={cx(styles.inner, isFilling && styles.filling)}>
            <div className={styles.title}>
                <h2>{name}</h2>
                <span>
                <img src='/approve.svg' />
                </span>
            </div>
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


