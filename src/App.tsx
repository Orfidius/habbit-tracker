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
/*
  Edit button:
   1. [x] Create edit button
   2. [x] Add edit state to redux
   3. [ ] Update UI in response to Edit button
   4. [ ] When card clicked in Edit mode, open "Add modal" with car data, edit modal now updates instead of creates
   5. [ ] Add Delete icon to cards

*/
export const App = () => {
  const [habits, sethabits] = useState<Array<Habit>>([]);
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
    sethabits(newHabits);
  };

  useEffect(() => {
    updateCards();
  }, []);

  return (
    <main className={styles.container}>
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
