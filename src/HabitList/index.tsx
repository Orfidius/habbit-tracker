import { FC, useEffect, useState } from "react";
import { Card } from "./HabitCard";
import styles from "./styles.module.scss";
import { Habit } from "../repositories/habit-repository";
import { DAYS_ENTRIES, TODAY } from "../constants";
import { Freq } from "../store/HabitState";

type Props = {
  habits: Array<Habit>;
  updateCards: () => Promise<void>;
};

export const Cardlist: FC<Props> = ({ habits, updateCards }) => {
  const [filteredHabits, setFilteredHabbits] = useState<Habit[]>([]);
  useEffect(() => {
    console.log("habits change", habits, filteredHabits);
    const [filterValue = "Su"] = DAYS_ENTRIES.at(TODAY) ?? [];
    const newHabits = habits.filter(({ frequency }) => {
      console.log("joker", { frequency }, frequency.has(filterValue));
      return frequency.has(filterValue);
    });
    console.log("Filtering habits", newHabits);
    setFilteredHabbits(newHabits);
  }, [habits.length]);
  return (
    <ul className={styles.cardList}>
      {filteredHabits.map((habit) => (
        <Card updateCards={updateCards} habit={habit} />
      ))}
    </ul>
  );
};
