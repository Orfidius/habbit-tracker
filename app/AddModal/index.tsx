import { FC, Reducer, useEffect, useReducer, useState } from "react";
import { styles } from "./AddModal.module-ai";
import {
  Habit,
  insertHabit,
  updateHabit,
} from "../repositories/habit-repository";
import { useAppSelector } from "../store/hooks";
import { useDispatch } from "react-redux";
import { setCurrentHabit } from "../store/EditMode";
import { Freq } from "../store/HabitState";
import React from "react";
import {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  View,
  Text,
} from "react-native";
import { Modal } from "react-native";
// import { Button } from "react-native";
import { Button } from "react-native-paper";
import { TextInput } from "react-native-paper";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "core-js/actual/object/group-by";
enum Actions {
  NAME,
  FREQUENCY,
  GOAL,
  MULTIPLE_FREQUENCY,
  SET,
}

type FrequencyAction = {
  type: Actions.FREQUENCY;
  payload: Freq;
};

type MultipleFrequencyAction = {
  type: Actions.MULTIPLE_FREQUENCY;
};

type NameAction = {
  type: Actions.NAME;
  payload: string;
};

type GoalAction = {
  type: Actions.GOAL;
  payload: string;
};

type SetAction = {
  type: Actions.SET;
  payload: Habit;
};

type ActionPayload =
  | FrequencyAction
  | NameAction
  | GoalAction
  | MultipleFrequencyAction
  | SetAction;

type ReactNativeChangeHandler = (
  e: NativeSyntheticEvent<TextInputChangeEventData>,
) => void;

const reducer: Reducer<Habit, ActionPayload> = (
  state: Habit,
  action: ActionPayload,
) => {
  switch (action.type) {
    case Actions.NAME:
      return { ...state, name: action.payload };
    case Actions.GOAL:
      return { ...state, goal: parseInt(action.payload, 10) };
    case Actions.FREQUENCY:
      const newFreq = new Set(state.frequency);
      if (newFreq.has(action.payload)) {
        newFreq.delete(action.payload);
      } else {
        newFreq.add(action.payload);
      }
      return { ...state, frequency: Array.from(newFreq) };
    case Actions.MULTIPLE_FREQUENCY: {
      const newFreq =
        state.frequency.length < 7
          ? [Freq.Su, Freq.M, Freq.Tu, Freq.W, Freq.Th, Freq.F, Freq.Sa]
          : [];
      return { ...state, frequency: Array.from(newFreq) };
    }
    case Actions.SET: {
      return { ...state, ...action.payload };
    }
  }
};

const initialState: Habit = {
  id: 0,
  name: "",
  iteration: 0,
  goal: 90,
  remind: false,
  frequency: [],
  createdAt: Date.now(),
  misses: 0,
};
type AddModalProps = {
  onClose: (f: () => void) => void;
};
export const AddModal: FC<AddModalProps> = ({ onClose }) => {
  const selectedHabit = useAppSelector(
    (state) => state.editModeState.selectedHabbit,
  );
  const showModal = useAppSelector((state) => state.habitState.modalOpen);
  const appDispatch = useDispatch();
  const [habit, dispatch] = useReducer(reducer, selectedHabit ?? initialState);
  const [isClosing, setIsClosing] = useState(false);
  const canSave = Object.entries(habit)
    .filter(
      ([key]) =>
        key !== "id" &&
        key !== "iteration" &&
        key !== "remind" &&
        key !== "misses" &&
        key !== "wins" &&
        key !== "createdAt",
    )
    .every(([key, value]) => {
      if (typeof value === "number") return value > 0;
      console.log(key, value);
      return typeof value === "boolean" || Array.from(value).length;
    });
  useEffect(() => {
    selectedHabit && dispatch({ type: Actions.SET, payload: selectedHabit });
  }, [selectedHabit]);
  const updateName: ReactNativeChangeHandler = (event) => {
    dispatch({ type: Actions.NAME, payload: event.nativeEvent.text });
  };
  const updateGoal: ReactNativeChangeHandler = (event) => {
    dispatch({ type: Actions.NAME, payload: event.nativeEvent.text });
  };

  const updateFrequency = (value: Freq) => {
    dispatch({ type: Actions.FREQUENCY, payload: value });
  };
  const selectAllFrequencies = () => {
    dispatch({ type: Actions.MULTIPLE_FREQUENCY });
  };
  const onSave = async () => {
    try {
      selectedHabit ? await updateHabit(habit) : await insertHabit(habit);
    } catch (e) {
      console.log(e);
    } finally {
      onClose(() => {
        setIsClosing(true);
        appDispatch(setCurrentHabit());
      });
    }
  };
  const onCancel = () => {
    onClose(() => {
      dispatch({ type: Actions.SET, payload: initialState });
      setIsClosing(true);
      appDispatch(setCurrentHabit());
    });
  };
  return (
    <Modal animationType="slide" transparent={true} visible={showModal}>
      <View style={styles.addModal}>
        <Text style={styles.heading}>Start a New habit</Text>
        <View>
          <InputText
            value={habit.name}
            onChange={updateName}
            label={"name"}
            name={"name"}
          />
          <InputText
            value={`${habit.goal}`}
            onChange={updateGoal}
            label={"goal"}
            name={"goal"}
          />
          <FrequencyInput
            value={habit?.frequency as Freq[]}
            setValue={updateFrequency}
            setValues={selectAllFrequencies}
          />
          <View style={styles.buttonWrapper}>
            <Button
              mode={"contained"}
              style={{ borderRadius: 12 }}
              buttonColor="#222"
              onPress={onSave}
              disabled={!canSave}
            >
              Save
            </Button>
            <Button
              mode={"outlined"}
              style={{ borderRadius: 12, borderWidth: 2, borderColor: "#222" }}
              textColor={"#222"}
              onPress={onCancel}
            >
              Cancel
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
type InputProps = {
  label: string;
  name: string;
  onChange: ReactNativeChangeHandler;
  value?: string;
};

export const InputText: FC<InputProps> = ({ label, name, onChange, value }) => (
  <View style={{}}>
    <TextInput
      value={value}
      onChange={onChange}
      placeholder={name}
      label={label}
      mode="outlined"
      style={{ backgroundColor: "#fff" }}
      activeOutlineColor="#222"
    />
  </View>
);

const FrequencyInput: FC<{
  value?: Array<Freq>;
  setValue: (val: Freq) => void;
  setValues: () => void;
}> = ({ value, setValue, setValues }) => {
  const FreqBox = MakeFreqCheck(value, setValue);
  return (
    <View
      style={{
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          ...styles.textWrapper,
          textAlign: "center",
          fontFamily: "PlayfairDisplay_800ExtraBold",
          fontSize: 26,
          marginTop: 14,
        }}
      >
        Set Day
      </Text>
      <View style={styles.frequency}>
        <FreqBox name="Monday" freqKey={Freq.M} />
        <FreqBox name="Tuesday" freqKey={Freq.Tu} />
        <FreqBox name="Wednesday" freqKey={Freq.W} />
        <FreqBox name="Thursday" freqKey={Freq.Th} />
        <FreqBox name="Friday" freqKey={Freq.F} />
        <FreqBox name="Saturday" freqKey={Freq.Sa} />
        <FreqBox name="Sunday" freqKey={Freq.Su} />
      </View>
      <Button
        style={{ borderRadius: 12 }}
        mode="contained"
        buttonColor="#222"
        onPress={setValues}
      >
        Everyday
      </Button>
    </View>
  );
};

const MakeFreqCheck = (
  value: Array<Freq> | undefined,
  setValue: (key: Freq) => void,
): FC<{ name: string; freqKey: Freq }> => {
  console.log(value);
  return ({ name, freqKey }) => {
    return (
      <Pressable onPress={() => setValue(freqKey)} style={styles.FreqBox}>
        <View style={styles.freqBoxTitle}>
          <Text style={styles.freqBoxTitle}>{freqKey}</Text>
        </View>
        {value && value?.includes(freqKey) && (
          <Ionicons
            style={{ marginTop: 5 }}
            name="checkmark-circle-sharp"
            size={24}
            color="black"
          />
        )}
      </Pressable>
    );
  };
};
