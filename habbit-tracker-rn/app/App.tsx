import { useEffect, useState } from "react";
import { styles } from "./App.module";
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
import { Button, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

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
    // const newHabits = await gethabits();
    // setHabits(newHabits);
  };

  useEffect(() => {
    updateCards();
  }, []);

  return (
    <View style={styles.container}>
      <FilterTabs />
      {/* <Celebration> // TODO replace */}
      {/* <View style={styles.cardContainer}>
        <Cardlist habits={habits} updateCards={updateCards} />
      </View> */}
      {/* {showModal &&  */}
      <AddModal onClose={onCloseModal} />
      {/* } */}
      {/* {!showModal && ( */}
      <TouchableOpacity
        onPress={addButtonHandler}
        style={[styles.FAB, styles.add]}
      >
        <Icon name="plus-circle" size={40} />
      </TouchableOpacity>
      {/* )} */}
      {/* {!showModal && ( */}
      <TouchableOpacity
        onPress={editButtonHandler}
        style={[styles.FAB, styles.edit]}
      >
        <Icon name="edit-2" size={30} />
      </TouchableOpacity>
      {/* )} */}
      {/* </Celebration> */}
    </View>
  );
};

export const Card = () => {};
