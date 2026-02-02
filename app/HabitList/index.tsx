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
  const filterValue = useAppSelector((state) => state.habitState.freqFilter);
  return (
    <FlatList
      style={styles.cardList}
      data={habits.filter(({ frequency }) => frequency.includes(filterValue))}
      renderItem={({ item }) => <Card updateCards={updateCards} habit={item} />}
      keyExtractor={(habit) => habit.id.toString()}
      contentContainerStyle={{ paddingBottom: 175 }}
    />
  );
};
