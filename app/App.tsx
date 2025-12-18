import React, { useEffect, useLayoutEffect, useState } from "react";
import { styles } from "./App.module";

import { AddModal } from "./AddModal";
import { Cardlist } from "./HabitList";
import {
  deleteHabit,
  gethabits,
  Habit,
  seedDB,
  updateHabits,
} from "./repositories/habit-repository";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./store/hooks";
import { setModalOpen } from "./store/HabitState";
import { setEditMode } from "./store/EditMode";
import { FilterTabs } from "./FilterTabs/FilterTabs";
import { StatusBar, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Celebration } from "./Celebration";
import { updateMisses } from "./services/misses-service";
import { Stats } from "./Stats";

export const App = () => {
  const [habits, setHabits] = useState<Array<Habit>>([]);
  const showModal = useAppSelector((state) => state.habitState.modalOpen);
  const editMode = useAppSelector((state) => state.editModeState.enabled);
  const dispatch = useDispatch();
  const { misses, wins } = useAppSelector((state) => state.habitState);

  useEffect(() => {
    (async () => {
      await updateCards();
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
    const newHabits = await gethabits();
    const habbitsWithMisses = updateMisses(newHabits);
    const getDoomedHabbits = habbitsWithMisses.filter(
      ({ misses = 0 }) => misses > 3,
    );
    getDoomedHabbits.forEach((habit) => {
      deleteHabit(habit.id);
    });
    const withOutDoomedHabbits = habits.filter(({ misses = 0 }) => misses <= 3);
    await updateHabits(withOutDoomedHabbits);
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
        <Stats wins={} misses={} />
      </Celebration>
    </View>
  );
};
