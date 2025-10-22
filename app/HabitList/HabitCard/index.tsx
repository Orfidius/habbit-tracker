import {
  deleteHabit,
  incrementHabit,
} from "../../repositories/habit-repository";
import { celebrationContext } from "../../Celebration";
import dayjs from "dayjs";
import { useAppSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { setCurrentHabit } from "../../store/EditMode";
import { setModalOpen } from "../../store/HabitState";
import {
  Animated,
  Text,
  TextStyle,
  View,
  useAnimatedValue,
} from "react-native";
import { Habit } from "@/app/repositories/habit-repository";
import React, {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { styles } from "./Card.module";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
import { Button } from "react-native";
import * as Haptics from "expo-haptics";
import { Vibration } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GLOW_CONFIG } from "./consts";
import AnimatedGlow from "react-native-animated-glow";

type Props = {
  habit: Habit;
  updateCards: () => Promise<void>;
};
type TimerReturn = ReturnType<typeof setTimeout>;

const widthInputRange = Array.from<number>({ length: 100 }).map((i) => i);
const widthOutputRange = widthInputRange.map((i) => `${i}%`);

export const Card: FC<Props> = ({
  habit: { id, name, iteration, goal, lastUpdated, misses = 0, ...habit },
  updateCards,
}) => {
  const { setShowCelebrate } = useContext(celebrationContext);
  const [isFilling, setIsFilling] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false);
  const isInEditMode = useAppSelector((state) => state.editModeState.enabled);
  const timerRef = useRef<TimerReturn | null>(null);
  const dispatch = useDispatch();
  const widthAnim = useAnimatedValue(0);
  const textFadeAnim = useAnimatedValue(0);
  const numFadeAnim = useAnimatedValue(0);
  const skullFadeAnim = useAnimatedValue(1);
  const [tickHaptic, setShouldTick] = useTickHaptic();

  useEffect(() => {
    if (lastUpdated) {
      const date = dayjs(lastUpdated);
      const now = dayjs().subtract(8, "hour");
      if (date.isAfter(now)) {
        setDisabled(true);
      }
    }
  }, [iteration]);
  useEffect(() => {
    if (disabled) {
      textFadeAnim.setValue(255);
      numFadeAnim.setValue(255);
    }
  }, [disabled]);
  useEffect(() => {}, []);
  const mouseDownHandler = () => {
    if (isInEditMode) return;
    !disabled && setIsFilling(true);
    if (!disabled) {
      setShouldTick(true);
      Animated.timing(widthAnim, {
        toValue: 100,
        duration: 1000,
        useNativeDriver: false,
      }).start();
      Animated.timing(textFadeAnim, {
        toValue: 255,
        duration: 300,
        useNativeDriver: false,
      }).start();
      Animated.timing(numFadeAnim, {
        toValue: 255,
        duration: 1120,
        useNativeDriver: false,
      }).start();
      Animated.timing(skullFadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
      tickHaptic(10);
      timerRef.current = setTimeout(async () => {
        setShowCelebrate(true);
        setDisabled(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        Vibration.vibrate(800);
        await incrementHabit(id, iteration);
        await updateCards();
      }, 1200);
    }
  };
  const mouseUpHandler = () => {
    setIsFilling(false);
    setShouldTick(false);
    widthAnim.setValue(0);
    textFadeAnim.setValue(0);
    numFadeAnim.setValue(0);
    skullFadeAnim.setValue(1);
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
    dispatch(setModalOpen(true));
  };
  const onDelete = async () => {
    await deleteHabit(id);
    await updateCards();
  };
  console.log({ lastUpdated });
  return (
    <View style={{ marginBottom: 16 }}>
      <ShouldGlow shouldGlow={disabled}>
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
              colors={["#011", "#001", "#000", "#000"]}
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
            <View style={styles.inner}>
              <View style={styles.title}>
                <Animated.Text
                  style={{
                    ...styles.heading,
                    ...(disabled ? styles.doneHeading : {}),
                    color: textFadeAnim.interpolate({
                      inputRange: [0, 255],
                      outputRange: ["rgb(0,0,0)", "rgb(255,255,255)"],
                    }),
                  }}
                >
                  {name}
                </Animated.Text>
                <View style={styles.approveBlock}>
                  <Animated.View
                    style={{
                      flexDirection: "row",
                      opacity: skullFadeAnim,
                    }}
                  >
                    {Array.from({ length: misses + 2 }).map(() => (
                      <Ionicons name="skull-outline" size={32} color="#000" />
                    ))}
                  </Animated.View>
                  {lastUpdated && <IncrementDate lastUpdated={lastUpdated} />}
                </View>
              </View>
              {isInEditMode && (
                <View style={styles.editButtons}>
                  <Button title={"Edit"} onPress={onEditHandler} />
                  <Button
                    title={"Delete"}
                    onPress={onDelete}
                    color={"#ff002b"}
                  />
                </View>
              )}
              {!isInEditMode && (
                <View style={styles.copy}>
                  <Animated.Text
                    style={{
                      ...styles.numbers,
                      color: numFadeAnim.interpolate({
                        inputRange: [0, 255],
                        outputRange: ["rgb(0,0,0)", "rgb(255,255,255)"],
                      }),
                    }}
                  >
                    {iteration}/{goal}
                  </Animated.Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </ShouldGlow>
    </View>
  );
};

const IncrementDate: FC<{
  lastUpdated: number;
}> = ({ lastUpdated }) => {
  const date = dayjs(lastUpdated).format("MMM DD [at] h:mm A");
  return <Text style={styles.lastUpdated}>{date}</Text>;
};

const useTickHaptic = (): [(max: number) => void, (arg: boolean) => void] => {
  const shouldTickHaptic = useRef<boolean>(true);
  const shouldTick = useRef(true);
  const tickHaptic = (max: number, current = 0) => {
    if (current < max && shouldTick.current) {
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        tickHaptic(max, current + 1);
      }, 50);
    }
  };
  const setShouldTick = (val: boolean) => {
    shouldTick.current = val;
  };
  return [tickHaptic, setShouldTick];
};

const ShouldGlow: FC<PropsWithChildren & { shouldGlow: boolean }> = ({
  children,
  shouldGlow,
}) =>
  shouldGlow ? (
    <AnimatedGlow style={{ width: "100%" }} preset={GLOW_CONFIG}>
      {children}
    </AnimatedGlow>
  ) : (
    <View>{children}</View>
  );
