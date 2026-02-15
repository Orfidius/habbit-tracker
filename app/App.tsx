import React, { useEffect, useLayoutEffect, useState } from "react";
import { styles } from "./App.module";
import { initHabitTable, seedDB } from "./repositories/habit-repository";
import { AddModal } from "./AddModal";
import { Cardlist } from "./HabitList";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./store/hooks";
import { setModalOpen } from "./store/HabitState";
import { setEditMode } from "./store/EditMode";
import { FilterTabs } from "./FilterTabs/FilterTabs";
import { StatusBar, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Celebration } from "./Celebration";
import { Stats } from "./Stats";
import { useProcessTransactions } from "./hooks/habit-hook";

export const App = () => {
  const showModal = useAppSelector((state) => state.habitState.modalOpen);
  const habits = useAppSelector((state) => state.habitState.habits);
  const editMode = useAppSelector((state) => state.editModeState.enabled);
  const dispatch = useDispatch();
  const { mutate: getHabits } = useProcessTransactions();

  useEffect(() => {
	  console.log('useEffect from App.tsx');
     (async () => {
      try {
        console.log("Initializing DB");
        await initHabitTable();
        await initStatsTable();
        // await seedDB();
        console.log("DB initialized successfully");
    	getHabits();
      } catch (e) {
        console.error("Failed to initialize database", e);
      }
    })();
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
    getHabits();
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
	<View style={styles.bottomBar}>
          <TouchableOpacity
          onPress={addButtonHandler}
          style={[styles.FAB, styles.add]}
        >
          <Icon name="plus-circle" size={40} />
        </TouchableOpacity>
        <Stats />
        <TouchableOpacity
          onPress={editButtonHandler}
          style={[styles.FAB, styles.edit]}
        >
          <Icon name="edit-2" size={30} />
        </TouchableOpacity>
	</View>
      </Celebration>
    </View>
  );
};
