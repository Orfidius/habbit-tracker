import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import { CgAddR } from "react-icons/cg";
import { AddModal } from "./AddModal";
import { Cardlist } from "./HabitList";
import { Celebration } from "./Celebration";
import { gethabits, Habit } from "./repositories/habit-repository";

export const App = () => {
  const [showModal, setShowModal] = useState<boolean>();
  const [habits, sethabits] = useState<Array<Habit>>([]);

  const addButtonHandler = () => {
    setShowModal(!showModal)
  }
  const onCloseModal = (closeClassSetter: () => void) => {
    closeClassSetter();
    setTimeout(() => {
      setShowModal(!showModal);
      updateCards();
    }, 900)
  }
  const updateCards = async () => {
    const newHabits = await gethabits();
    sethabits(newHabits);
  }

  useEffect(() => {
    updateCards();
  }, []);

  return (
    <main className={styles.container}>
      <Celebration>
        <section className={styles.cardContainer}>
          <Cardlist habits={habits} updateCards={updateCards}/>
        </section>
        {showModal && <AddModal onClose={onCloseModal} />}
        {!showModal && <button onClick={addButtonHandler} className={styles.FAB}>
          <CgAddR />
        </button>}
      </Celebration>
    </main>
  );
}

export const Card = () => { }

