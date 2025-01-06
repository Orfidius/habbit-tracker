import { FC, useEffect, useState } from "react";
import { Card } from "./HabitCard";
import styles from "./styles.module.scss";
import { Habit } from "../repositories/habit-repository";
import { useAppSelector } from "../store/hooks";

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
    <ul className={styles.cardList}>
      {filteredHabits.map((habit) => (
        <Card updateCards={updateCards} habit={habit} />
      ))}
    </ul>
  );
};
