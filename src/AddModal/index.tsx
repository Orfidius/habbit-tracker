import { FC } from "react"
import styles from './AddModal.module.scss';

export const AddModal = () => 
    <section className={styles.AddModal}>
      <h2>Start New Habbit</h2>
      <form>
          <TextInput label={"name"} name={"name"} />
          <TextInput label={"goal"} name={"goal"} />
          <div className={styles.buttonWrapper}>
            <button>
              Save
            </button>
            <button>
              Cancel
            </button>
          </div>
      </form>
    </section>
    
    export const TextInput: FC<{label: string, name: string}> = ({label, name}) => 
      <div className={styles.textInput}>
        <label htmlFor={name}>{label}</label>
        <input name={name} type="text" id={name} />
      </div>
    
    