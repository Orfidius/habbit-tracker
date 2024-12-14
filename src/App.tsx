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
import { setEditMode } from "./store/HabitState";
/*
  Edit button:
   1. Create edit button
   2. Add edit state to redux
   3. Update UI in response to Edit button
   4. When card clicked in Edit mode, open "Add modal" with car data, edit modal now updates instead of creates
   5.Add Delet icon to cards

*/
export const App = () => {
  const [showModal, setShowModal] = useState<boolean>();
  const [habits, sethabits] = useState<Array<Habit>>([]);
  const dispatch = useDispatch();
  const addButtonHandler = () => {
    setShowModal(!showModal);
  };
  const editButtonHandler = () => {
    setShowModal(!showModal);
    dispatch(setEditMode());
  };
  const onCloseModal = (closeClassSetter: () => void) => {
    closeClassSetter();
    setTimeout(() => {
      setShowModal(!showModal);
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
