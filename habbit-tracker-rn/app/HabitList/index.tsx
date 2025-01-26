import { FC, useEffect, useState } from "react";
import { Card } from "./HabitCard";
import { styles } from "./styles.module";
import { Habit } from "../repositories/habit-repository";
import { useAppSelector } from "../store/hooks";
import { FlatList } from "react-native";

type Props = {
  habits: Array<Habit>;
  updateCards: () => Promise<void>;
};

export const Cardlist: FC<Props> = ({ habits, updateCards }) => {
  const [filteredHabits, setFilteredHabbits] = useState<Habit[]>([]);
  const filterValue = useAppSelector((state) => state.habitState.freqFilter);
  useEffect(() => {
    const newHabits = habits.filter(({ frequency }) =>
      frequency.has(filterValue),
    );
    setFilteredHabbits(newHabits);
  }, [habits.length, filterValue]);
  return (
    <FlatList
      style={styles.cardList}
      data={filteredHabits}
      renderItem={({ item }) => <Card updateCards={updateCards} habit={item} />}
      keyExtractor={(habit) => habit.id.toString()}
    />
  );
};
