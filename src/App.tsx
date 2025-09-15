import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import { CgAddR } from "react-icons/cg";
import { MdModeEditOutline } from "react-icons/md";

import { AddModal } from "./AddModal";
import { Cardlist } from "./HabitList";
import { Celebration } from "./Celebration";
import { gethabits, Habit } from "./repositories/habit-repository";
import cx from "classnames";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./store/hooks";
import { setModalOpen } from "./store/HabitState";
import { setEditMode } from "./store/EditMode";
import { FilterTabs } from "./FilterTabs/FilterTabs";

export const App = () => {
  const [habits, setHabits] = useState<Array<Habit>>([]);
  const showModal = useAppSelector((state) => state.habitState.modalOpen);
  const dispatch = useDispatch();
  const addButtonHandler = () => {
    dispatch(setModalOpen());
  };
  const editButtonHandler = () => {
    dispatch(setEditMode());
  };
  const onCloseModal = (closeClassSetter: () => void) => {
    closeClassSetter();
    setTimeout(() => {
      dispatch(setModalOpen());
      updateCards();
    }, 900);
  };
  const updateCards = async () => {
    const newHabits = await gethabits();
    setHabits(newHabits);
  };

  useEffect(() => {
    updateCards();
  }, []);

  return (
    <main className={styles.container}>
      <FilterTabs />
      <Celebration>
        <section className={styles.cardContainer}>
          <Cardlist habits={habits} updateCards={updateCards} />
        </section>
        {showModal && <AddModal onClose={onCloseModal} />}
        {!showModal && (
          <button
            onClick={addButtonHandler}
            className={cx(styles.FAB, styles.add)}
          >
            <CgAddR />
          </button>
        )}
        {!showModal && (
          <button
            onClick={editButtonHandler}
            className={cx(styles.FAB, styles.edit)}
          >
            <MdModeEditOutline />
          </button>
        )}
      </Celebration>
    </main>
  );
};

export const Card = () => {};
