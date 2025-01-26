// import { Habit, incrementHbbit as incrementHabbit } from "../../repositories/habit-repository";
import cx from "classnames";
import { celebrationContext } from "../../Celebration";
import dayjs from "dayjs";
import { MdModeEditOutline } from "react-icons/md";
import { useAppSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { setCurrentHabit } from "../../store/EditMode";
import { setModalOpen } from "../../store/HabitState";
import { Text, TouchableOpacity, View } from "react-native";
import { Habit } from "@/app/repositories/habit-repository";
import { FC, useContext, useEffect, useRef, useState } from "react";
// import { styles } from "../styles.module";
import { styles } from './Card.module-ai';

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
        // TODO: Reset
        // await incrementHabbit(id, iteration);
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
      setCurrentHabit({
        id,
        name,
        iteration,
        goal,
        lastUpdated,
        ...habit,
      } as Habit),
    );
    dispatch(setModalOpen());
  };

  return (
    <TouchableOpacity
      onPressIn={mouseDownHandler}
      // onPress={mouseDownHandler}
      // onMouseUp={mouseUpHandler}
      // onTouchEnd={mouseUpHandler}
      onPressOut={mouseUpHandler}
      style={[styles.card, ...(disabled ? [styles.doneForDay] : [])]}
    >
      <View style={styles.outer}>
        {isInEditMode && (
          <button
            style={styles.edit}
            onTouchStart={onEditHandler}
            onMouseDown={onEditHandler}
          >
            <MdModeEditOutline />
          </button>
        )}
        <View style={cx(styles.inner, isFilling && styles.filling)}>
          <View style={styles.title}>
            <h2>{name}</h2>
            <View style={styles.approveBlock}>
              {lastUpdated && <IncrementDate lastUpdated={lastUpdated} />}
              <span style={styles.approveIcon}>
                <img src="/approve.svg" />
              </span>
            </View>
          </View>
          <View style={styles.copy}>
            {/* TODO: Add "Last Updated" */}
            <Text style={styles.numbersCopy}>
              <strong>Followed through on:</strong>
            </Text>
            <Text style={styles.numbers}>
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
  return <span style={styles.lastUpdated}>{date}</span>;
};
