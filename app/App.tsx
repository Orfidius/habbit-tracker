import React, { useEffect, useState } from "react";
import { styles } from "./App.module";
import { CgAddR } from "react-icons/cg";
import { MdModeEditOutline } from "react-icons/md";

import { AddModal } from "./AddModal";
import { Cardlist } from "./HabitList";
import {
  gethabits,
  Habit,
  initDB,
  updateHabits,
} from "./repositories/habit-repository";
import cx from "classnames";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./store/hooks";
import { setModalOpen } from "./store/HabitState";
import { setEditMode } from "./store/EditMode";
import { FilterTabs } from "./FilterTabs/FilterTabs";
import { Button, StatusBar, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import LottieView from "lottie-react-native";
import { Celebration } from "./Celebration";
import { updateMisses } from "./services/misses-service";

export const App = () => {
  const [habits, setHabits] = useState<Array<Habit>>([]);
  const showModal = useAppSelector((state) => state.habitState.modalOpen);
  const editMode = useAppSelector((state) => state.editModeState.enabled);
  const dispatch = useDispatch();

  useEffect(() => {
    updateCards();
  }, []);

  const addButtonHandler = () => {
    dispatch(setModalOpen(true));
  };
  const editButtonHandler = () => {
    dispatch(setEditMode(!editMode));
  };
  const onCloseModal = (closeClassSetter: () => void) => {
    closeClassSetter();
    dispatch(setModalOpen(false));
    updateCards();
  };
  const updateCards = async () => {
    const newHabits = await gethabits();
    const habbitsWithMisses = updateMisses(newHabits);
    await updateHabits(habbitsWithMisses);
    setHabits(habbitsWithMisses);
  };
  return (
    <View style={styles.container}>
      <Celebration>
        <StatusBar backgroundColor="#222" />
        <FilterTabs />
        <View style={styles.cardContainer}>
          <Cardlist habits={habits} updateCards={updateCards} />
        </View>
        <AddModal onClose={onCloseModal} />
        <TouchableOpacity
          onPress={addButtonHandler}
          style={[styles.FAB, styles.add]}
        >
          <Icon name="plus-circle" size={40} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={editButtonHandler}
          style={[styles.FAB, styles.edit]}
        >
          <Icon name="edit-2" size={30} />
        </TouchableOpacity>
      </Celebration>
    </View>
  );
};
