import styles from "./Card.module.scss";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { Habit, incrementHbbit } from "../../repositories/habit-repository";
import cx from "classnames";
import { celebrationContext } from "../../Celebration";
import dayjs from "dayjs";
import { MdModeEditOutline } from "react-icons/md";
import { useAppSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { setCurrentHabit } from "../../store/EditMode";
import { setModalOpen } from "../../store/HabitState";
import {
  // vibrate,
  impactFeedback,
  // notificationFeedback,
  // selectionFeedback,
} from "@tauri-apps/plugin-haptics";
import { Text, View } from "react-native";

// await vibrate(1)
// await impactFeedback('medium')
// await notificationFeedback('warning')
// await selectionFeedback()

type Props = {
  habit: Habit;
  updateCards: () => Promise<void>;
};
type TimerReturn = ReturnType<typeof setTimeout>;

export const Card: FC<Props> = ({
  habit: { id, name, iteration, goal, lastUpdated, ...habit },
  updateCards,
}) => {
  const { setShowCelebrate } = useContext(celebrationContext);
  const [isFilling, setIsFilling] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false);
  const isInEditMode = useAppSelector((state) => state.editModeState.enabled);
  const timerRef = useRef<TimerReturn | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (lastUpdated) {
      const date = dayjs(lastUpdated);
      const now = dayjs().subtract(8, "hour");
      if (date.isAfter(now)) {
        setDisabled(true);
      }
    }
  }, [iteration]);

  const mouseDownHandler = () => {
    if (isInEditMode) return;
    !disabled && setIsFilling(true);
    if (!disabled) {
      timerRef.current = setTimeout(async () => {
        setShowCelebrate(true);
        // setDisabled(true);
        // // await impactFeedback('medium')
        // // await vibrate(1)
        // await impactFeedback('medium')
        // await notificationFeedback('warning')
        // await selectionFeedback()
        await impactFeedback("heavy");
        await incrementHbbit(id, iteration);
        await updateCards();
      }, 1200);
    }
  };
  const mouseUpHandler = () => {
    setIsFilling(false);
    timerRef.current && clearTimeout(timerRef.current);
  };

  const onEditHandler = () => {
    dispatch(
      setCurrentHabit({ id, name, iteration, goal, lastUpdated, ...habit }),
    );
    dispatch(setModalOpen());
  };

  return (
    <li
      onMouseDown={mouseDownHandler}
      onTouchStart={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onTouchEnd={mouseUpHandler}
      onMouseOut={mouseUpHandler}
      className={cx(styles.card, disabled && styles.doneForDay)}
    >
      <View className={styles.outer}>
        {isInEditMode && (
          <button
            className={styles.edit}
            onTouchStart={onEditHandler}
            onMouseDown={onEditHandler}
          >
            <MdModeEditOutline />
          </button>
        )}
        <View className={cx(styles.inner, isFilling && styles.filling)}>
          <View className={styles.title}>
            <h2>{name}</h2>
            <View className={styles.approveBlock}>
              {lastUpdated && <IncrementDate lastUpdated={lastUpdated} />}
              <span className={styles.approveIcon}>
                <img src="/approve.svg" />
              </span>
            </View>
          </View>
          <View className={styles.copy}>
            {/* TODO: Add "Last Updated" */}
            <Text className={styles.numbersCopy}>
              <strong>Followed through on:</strong>
            </Text>
            <Text className={styles.numbers}>
              {iteration}/{goal}
            </Text>
          </View>
        </View>
      </View>
    </li>
  );
};

const IncrementDate: FC<{ lastUpdated: number }> = ({ lastUpdated }) => {
  const date = dayjs(lastUpdated).format("MMM DD [at] h:mm A");
  return <span className={styles.lastUpdated}>{date}</span>;
};
