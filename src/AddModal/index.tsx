import {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  Reducer,
  useEffect,
  useReducer,
  useState,
} from "react";
import styles from "./AddModal.module.scss";
import cx from "classnames";
import {
  Frequency,
  Habit,
  insertHabit,
  updateHabit,
} from "../repositories/habit-repository";
import { useAppSelector } from "../store/hooks";

enum Actions {
  NAME,
  FREQUENCY,
  GOAL,
}

type FrequencyAction = {
  type: Actions.FREQUENCY;
  payload: Frequency;
};

type NameAction = {
  type: Actions.NAME;
  payload: string;
};

type GoalAction = {
  type: Actions.GOAL;
  payload: string;
};

type ActionPayload = FrequencyAction | NameAction | GoalAction;

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
      return { ...state, frequency: action.payload };
  }
};

const initialState: Habit = {
  id: 0,
  name: "",
  iteration: 0,
  goal: 90,
  remind: false,
  frequency: Frequency.DAILY,
};
type AddModalProps = {
  onClose: (f: () => void) => void;
};
export const AddModal: FC<AddModalProps> = ({ onClose }) => {
  const selectedHabit = useAppSelector(
    (state) => state.editModeState.selectedHabbit,
  );
  const [habit, dispatch] = useReducer(reducer, selectedHabit ?? initialState);
  const [isClosing, setIsClosing] = useState(false);
  const updateName: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    dispatch({ type: Actions.NAME, payload: value });
  };
  const updateGoal: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    dispatch({ type: Actions.NAME, payload: value });
  };

  const updateFrequency = (value: string) => {
    dispatch({ type: Actions.NAME, payload: value });
  };
  const onSave: MouseEventHandler<HTMLButtonElement> = async () => {
    // TODO: Do something different if we have a selectedHabit
    console.log(habit);
    try {
      selectedHabit ? await updateHabit(habit) : await insertHabit(habit);
    } catch (e) {
      console.log(e);
    } finally {
      onClose(() => {
        setIsClosing(true);
      });
    }
  };
  const onCancel = () => {
    onClose(() => {
      setIsClosing(true);
    });
  };
  return (
    <section
      className={cx(
        styles.AddModal,
        isClosing ? styles.closing : styles.opening,
      )}
    >
      <h2>Start New habit</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <TextInput
          value={habit.name}
          onChange={updateName}
          label={"name"}
          name={"name"}
        />
        <TextInput
          value={`${habit.goal}`}
          onChange={updateGoal}
          label={"goal"}
          name={"goal"}
        />
        <FrequencyInput value={habit.frequency} setValue={updateFrequency} />
        <div className={styles.buttonWrapper}>
          <button onClick={onSave}>Save</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </section>
  );
};
type InputProps = {
  label: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value?: string;
};

export const TextInput: FC<InputProps> = ({ label, name, onChange, value }) => (
  <div className={styles.textInput}>
    <label htmlFor={name}>{label}</label>
    <input
      value={value}
      onChange={onChange}
      name={name}
      type="text"
      id={name}
    />
  </div>
);

const FrequencyInput: FC<{
  value: string;
  setValue: (val: string) => void;
}> = ({ value }) => {
  const [local, setLocal] = useState(value.split(""));
  // useEffect(() => {
  //   if (value.length > 0) {
  //     // copy our map to avoid a accidental re-rerender
  //     const frequency = value.split("").reduce((a, el) => {
  //       a.set(el, true);
  //       return a;
  //     }, new Map());
  //   }
  // }, [value]);
  const getState = (key: string) => local.includes(key);
  return (
    <div className={styles.frequency}>
      <p>habit Frequency</p>
      <input
        type="checkbox"
        id="monday"
        name="Monday"
        checked={local.includes("M")}
      />
      <label htmlFor="vehicle1">M</label>
      <input type="checkbox" id="tuesday" name="Tuesday" value="false" />
      <label htmlFor="vehicle2"> Tu</label>
      <input type="checkbox" id="Wednesday" name="Wednesday" value="false" />
      <label htmlFor="vehicle3">W</label>
      <input type="checkbox" id="Thursday" name="Thursday" value="false" />
      <label htmlFor="vehicle3">Th</label>
      <input type="checkbox" id="Friday" name="Friday" value="false" />
      <label htmlFor="vehicle3">F</label>
      <input type="checkbox" id="Saturday" name="Saturday" value="false" />
      <label htmlFor="vehicle3">Sa</label>
      <input type="checkbox" id="Sunday" name="Sunday" value="false" />
      <label htmlFor="vehicle3">Su</label>
    </div>
  );
};
