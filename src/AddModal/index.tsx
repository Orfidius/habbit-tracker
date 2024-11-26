import { ChangeEventHandler, FC, MouseEventHandler, Reducer, useReducer, useState } from "react"
import styles from './AddModal.module.scss';
import cx from 'classnames';
import { Frequency, habit, inserthabit } from "../repositories/habit-repository";

enum Actions {
  NAME,
  FREQUENCY,
  GOAL,
}

type FrequencyAction = {
  type: Actions.FREQUENCY,
  payload: Frequency,
}

type NameAction = {
  type: Actions.NAME,
  payload: string,
}

type GoalAction = {
  type: Actions.GOAL,
  payload: string,
}

type ActionPayload = FrequencyAction | NameAction | GoalAction;

const reducer: Reducer<habit, ActionPayload> = (state: habit, action: ActionPayload) => {
  switch (action.type) {
    case Actions.NAME:
      return { ...state, name: action.payload };
    case Actions.GOAL:
      return { ...state, goal: parseInt(action.payload, 10) };
    case Actions.FREQUENCY:
      return { ...state, frequency: action.payload }
  }
};

const initialState: habit = {
  id: 0,
  name: "",
  iteration: 0,
  goal: 90,
  remind: false,
  frequency: Frequency.DAILY
};
type AddModalProps = {
  onClose: (f: () => void) => void,
}
export const AddModal: FC<AddModalProps> = ({onClose}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isClosing, setIsClosing] = useState(false);
  const updateName: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    dispatch({ type: Actions.NAME, payload: value })
  }
  const updateGoal: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    dispatch({ type: Actions.NAME, payload: value })
  }

  const updateFrequency: ChangeEventHandler<HTMLSelectElement> = ({ target: { value } }) => {
    dispatch({ type: Actions.NAME, payload: value })
  }
  const onSave: MouseEventHandler<HTMLButtonElement> =  async () => {
    console.log(state);
    try {
     await inserthabit(state);
    } catch (e) {
      console.log(e);
    } finally {
      onClose(() => {setIsClosing(true)});
    }
  }
  const onCancel = () => {
    onClose(() => {setIsClosing(true)});
  }
  return <section className={cx(styles.AddModal, isClosing ? styles.closing : styles.opening)}>
    <h2>Start New habit</h2>
    <form onSubmit={(e) => {e.preventDefault()}}>
      <TextInput value={state.name} onChange={updateName} label={"name"} name={"name"} />
      <TextInput value={`${state.goal}`} onChange={updateGoal} label={"goal"} name={"goal"} />
      <div className={styles.frequency}>
        <label htmlFor="frequency">habit Frequency</label>
        <select onChange={updateFrequency} name="frequency" id="frequency">
          <option value="daily">daily</option>
          <option value="weekly">weekly</option>
          <option value="monthly">monthly</option>
        </select>
      </div>
      <div className={styles.buttonWrapper}>
        <button onClick={onSave}>
          Save
        </button>
        <button onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  </section>;
}
type InputProps = {
  label: string,
  name: string,
  onChange: ChangeEventHandler<HTMLInputElement>,
  value?: string,
}

export const TextInput: FC<InputProps> = ({ label, name, onChange, value }) =>
  <div className={styles.textInput}>
    <label htmlFor={name}>{label}</label>
    <input value={value} onChange={onChange} name={name} type="text" id={name} />
  </div>

