import { useState } from "react";
import styles from "./App.module.scss";
import { CgAddR } from "react-icons/cg";
import { AddModal } from "./AddModal";
import { Cardlist } from "./CardList";

export const App = () => {
  const [showModal, setShowModal] = useState<boolean>();
  const addButtonHandler = () => {
    setShowModal(!showModal)
  }
  const onCloseModal = (closeClassSetter: () => void) => {
    closeClassSetter();
    setTimeout(() => {
      setShowModal(!showModal)
    }, 1010)
  }
  return (
    <main className={styles.container}>
      <section className={styles.cardContainer}>
          <Cardlist />
      </section>
      {showModal && <AddModal onClose={onCloseModal} />} 
      {!showModal && <button onClick={addButtonHandler} className={styles.FAB}>
        <CgAddR />
      </button>}
    </main>
  );
}

export const Card = () => {}

