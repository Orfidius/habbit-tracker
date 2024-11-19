import { FC, Reducer, useReducer } from "react"
import styles from './AddModal.module.scss';
import { invoke } from '@tauri-apps/api/core';
import { Frequency, Habbit } from "../repositories/habbit-repository";


enum Actions {
  NAME,
  FREQUENCY,
  GOAL,
}

type ActionPayload = {
  type: Actions,
  payload: string | number,
}

const reducer = (state: Habbit, action: ActionPayload ) => {
  switch (action.type) {
    case Actions.NAME:
      return { ...state, name: action.payload };
    case Actions.GOAL:
      return { ...state, goal: action.payload };
    case Actions.FREQUENCY:
      return {...state, frequency: action.payload }
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

const initialState: Habbit = {
  id: 0,
  name: "",
  iteration: 0,
  goal: 0,
  remind: false,
  frequency: Frequency.DAILY
};

export const AddModal = () => 
    {
      const [state, dispatch] = useReducer(reducer, initialState);
      const onSaveHandler = () =>{
       invoke('save_habbit');
      }

    return <section className={styles.AddModal}>
      <h2>Start New Habbit</h2>
      <form>
        <TextInput label={"name"} name={"name"} />
        <TextInput label={"goal"} name={"goal"} />
        <div className={styles.frequency}>
        <label htmlFor="frequency">Habbit Frequency</label>
        <select name="frequency" id="frequency">
         <option value="daily">daily</option>
          <option value="weekly">weekly</option>
          <option value="monthly">monthly</option>
        </select>
        </div>
        <div className={styles.buttonWrapper}>
          <button onClick={onSaveHandler}>
            Save
          </button>
          <button>
            Cancel
          </button>
        </div>
      </form>
    </section>;
  }
    
    export const TextInput: FC<{label: string, name: string}> = ({label, name}) => 
      <div className={styles.textInput}>
        <label htmlFor={name}>{label}</label>
        <input name={name} type="text" id={name} />
      </div>
    
    