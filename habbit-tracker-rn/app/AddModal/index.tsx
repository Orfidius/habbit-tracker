import {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  Reducer,
  useReducer,
  useState,
} from "react";
// import styles from "./AddModal.module.scss";
// import cx from "classnames";
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
  TextInput,
  TextInputChangeEventData,
  View,
  Text,
} from "react-native";
import { Modal } from "react-native";
import { Button } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

enum Actions {
  NAME,
  FREQUENCY,
  GOAL,
  MULTIPLE_FREQUENCY,
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

type ActionPayload =
  | FrequencyAction
  | NameAction
  | GoalAction
  | MultipleFrequencyAction;

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
      return { ...state, frequency: newFreq };
    case Actions.MULTIPLE_FREQUENCY: {
      const newFreq =
        state.frequency.size < 7
          ? [Freq.Su, Freq.M, Freq.Tu, Freq.W, Freq.Th, Freq.F, Freq.Sa]
          : [];
      return { ...state, frequency: new Set(newFreq) };
    }
  }
};

const initialState: Habit = {
  id: 0,
  name: "",
  iteration: 0,
  goal: 90,
  remind: false,
  frequency: new Set(),
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

  const updateName: ReactNativeChangeHandler = ({
    target: { text: value },
  }) => {
    dispatch({ type: Actions.NAME, payload: value });
  };
  const updateGoal: ReactNativeChangeHandler = ({ target: { value } }) => {
    dispatch({ type: Actions.NAME, payload: value });
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
      setIsClosing(true);
      appDispatch(setCurrentHabit());
    });
  };
  return (
    <Modal
      animationType="slide"
      // transparent={true}
      visible={showModal}
      // className={cx(
      //   styles.AddModal,
      //   isClosing ? styles.closing : styles.opening,
      // )}
    >
      <Text>Start New habit</Text>
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
          value={habit.frequency as Set<Freq>}
          setValue={updateFrequency}
          setValues={selectAllFrequencies}
        />
        <View style={styles.buttonWrapper}>
          <Button onPress={onSave} title={"Save"} />
          <Button onPress={onCancel} title={"Cancel"} />
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
  <View style={styles.textInput}>
    <Text>{label}</Text>
    <TextInput value={value} onChange={onChange} placeholder={name} />
  </View>
);

const FrequencyInput: FC<{
  value: Set<Freq>;
  setValue: (val: Freq) => void;
  setValues: () => void;
}> = ({ value, setValue, setValues }) => {
  const FreqBox = MakeFreqCheck(value, setValue);
  return (
    <View style={styles.frequency}>
      <Text>habit Frequency</Text>
      <FreqBox name="Monday" freqKey={Freq.M} />
      <FreqBox name="Tuesday" freqKey={Freq.Tu} />
      <FreqBox name="Wednesday" freqKey={Freq.W} />
      <FreqBox name="Thursday" freqKey={Freq.Th} />
      <FreqBox name="Friday" freqKey={Freq.F} />
      <FreqBox name="Saturday" freqKey={Freq.Sa} />
      <FreqBox name="Sunday" freqKey={Freq.Su} />
      <Button onPress={setValues} title={"Everyday"} />
    </View>
  );
};

const MakeFreqCheck =
  (
    value: Set<Freq>,
    setValue: (key: Freq) => void,
  ): FC<{ name: string; freqKey: Freq }> =>
  ({ name, freqKey }) => {
    return (
      <>
        <Text>{freqKey}</Text>
        <BouncyCheckbox
          isChecked={value.has(freqKey)}
          onPress={() => setValue(freqKey)}
        />
        {/*
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={value.has(freqKey)}
          onChange={() => setValue(freqKey)}
        /> */}
      </>
    );
  };
