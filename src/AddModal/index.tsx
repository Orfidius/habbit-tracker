import { FC } from "react"
import styles from './AddModal.module.scss';
import { invoke } from '@tauri-apps/api/core';


export const AddModal = () => 
    {
    const onSaveHandler = () =>{
       invoke('save_habbit');
      }

    return <section className={styles.AddModal}>
      <h2>Start New Habbit</h2>
      <form>
        <TextInput label={"name"} name={"name"} />
        <TextInput label={"goal"} name={"goal"} />
        <label htmlFor="frequency">Habbut Frequency</label>
        <select name="frequency" id="frequency">
         <option value="daily">daily</option>
          <option value="weekly">weekly</option>
          <option value="monthly">monthly</option>
      </select>
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
    
    