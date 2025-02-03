import { incrementHabit } from "../../repositories/habit-repository";
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
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { Pressable } from "react-native";

type Props = {
  habit: Habit;
  updateCards: () => Promise<void>;
};
type TimerReturn = ReturnType<typeof setTimeout>;

const widthInputRange = Array.from<number>({ length: 100 }).map((i) => i);
const widthOutputRange = widthInputRange.map((i) => `${i}%`);

export const Card: FC<Props> = ({
  habit: { id, name, iteration, goal, lastUpdated, ...habit },
  updateCards,
}) => {
  console.log("Batman", { id, name, iteration, goal, lastUpdated, ...habit });
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
      useNativeDriver: false,
    }).start();
    if (!disabled) {
      timerRef.current = setTimeout(async () => {
        setShowCelebrate(true);
        setDisabled(true);
        // TODO: Reset
        await incrementHabit(id, iteration);
        await updateCards();
      }, 1200);
    }
  };
  const mouseUpHandler = () => {
    setIsFilling(false);
    widthAnim.setValue(0);
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
    <View>
      <Pressable
        onPressIn={mouseDownHandler}
        onPressOut={mouseUpHandler}
        style={[styles.card, ...(disabled ? [styles.doneForDay] : [])]}
      >
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            opacity: 0.75,
            height: "100%",
            borderRadius: 5,
            width: widthAnim.interpolate({
              inputRange: [0, 50, 100],
              outputRange: ["0%", "50%", "100%"],
            }),
          }}
        >
          <LinearGradient
            colors={["#252c3d", "#51596d", "#51596d", "#727d96"]}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
              borderRightColor: "#333",
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
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
      </Pressable>
    </View>
  );
};

const IncrementDate: FC<{ lastUpdated: number }> = ({ lastUpdated }) => {
  const date = dayjs(lastUpdated).format("MMM DD [at] h:mm A");
  return <Text style={styles.lastUpdated}>{date}</Text>;
};
