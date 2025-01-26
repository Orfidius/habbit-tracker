// import { Habit, incrementHbbit as incrementHabbit } from "../../repositories/habit-repository";
import { celebrationContext } from "../../Celebration";
import dayjs from "dayjs";
import { MdModeEditOutline } from "react-icons/md";
import { useAppSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { setCurrentHabit } from "../../store/EditMode";
import { setModalOpen } from "../../store/HabitState";
import {
  Animated,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
  StyleSheet,
} from "react-native";
import { Habit } from "@/app/repositories/habit-repository";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
// import { styles } from "../styles.module";
import { styles } from "./Card.module-ai";
import { LinearGradient } from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";

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
  const widthAnim = useAnimatedValue(0); // Initial value for opacity: 0

  // useEffect(() => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 10000,
  //     useNativeDriver: true,
  //   }).start();
  // }, [fadeAnim]);

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
    Animated.timing(widthAnim, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: true,
    }).start();
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
      onPressOut={mouseUpHandler}
      style={[styles.card, ...(disabled ? [styles.doneForDay] : [])]}
    >
      {/* backgroundImage: "linear-gradient(to right, #697eb48a, 30%, #51596d, 95%, #c1cae1)", */}
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={["#697eb48a", "#51596d", "#c1cae1"]}
        style={{ width: `${widthAnim}%` } as StyleSheet.NamedStyles<unknown>}
      />
      <View style={styles.outer}>
        {isInEditMode && (
          <TouchableOpacity style={styles.edit} onPress={onEditHandler}>
            <Icon name="edit" />
          </TouchableOpacity>
        )}
        <View style={styles.inner}>
          <View style={styles.title}>
            <Text style={styles.heading}>{name}</Text>
            <View style={styles.approveBlock}>
              {lastUpdated && <IncrementDate lastUpdated={lastUpdated} />}
              {/* <span style={styles.approveIcon}>
                <img src="/approve.svg" />
              </span> */}
            </View>
          </View>
          <View style={styles.copy}>
            {/* TODO: Add "Last Updated" */}
            <Text style={styles.numbersCopy}>Followed through on:</Text>
            <Text style={styles.numbers}>
              {iteration}/{goal}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const IncrementDate: FC<{ lastUpdated: number }> = ({ lastUpdated }) => {
  const date = dayjs(lastUpdated).format("MMM DD [at] h:mm A");
  return <Text style={styles.lastUpdated}>{date}</Text>;
};

/*
const FadeInView: React.FC<FadeInViewProps> = props => {
  const fadeAnim = useAnimatedValue(0); // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}>
      {props.children}
    </Animated.View>

*/
