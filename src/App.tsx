import { useState } from "react";
import styles from "./App.module.scss";
import { CgAddR } from "react-icons/cg";
import { AddModal } from "./AddModal";

export const App = () => {
  const [showModal, setShowModal] = useState<boolean>();
  const addButtonHandler = () => {
    setShowModal(!showModal)
  }
  return (
    <main className={styles.container}>
      <section className={styles.cardContainer}>
          <div className={styles.card}>
            <h2>My Habbit</h2>
            <div className={styles.copy}>
              <p className={styles.numbersCopy}>
                <strong>Followed through on:</strong>
              </p>
              <p className={styles.numbers}>42/90</p>
            </div>
          </div>
          <div className={styles.card}>
            <h2>My Habbit</h2>
            <div className={styles.copy}>
              <p className={styles.numbersCopy}>
                <strong>Followed through on:</strong>
              </p>
              <p className={styles.numbers}>42/90</p>
            </div>
          </div>
      </section>
      {showModal && <AddModal />} 
      {!showModal && <button onClick={addButtonHandler} className={styles.FAB}>
        <CgAddR />
      </button>}
    </main>
  );
}

export const Card = () => {}

