import { FC } from "react";
import { Card } from "./HabitCard";
import styles from './styles.module.scss';
import { Habit } from "../repositories/habit-repository";

type Props = {
    habits: Array<Habit>;
    updateCards: () => Promise<void>;
}

export const Cardlist: FC<Props> = ({habits, updateCards}) => {

return <ul className={styles.cardList}>
    {habits.map(habit => <Card updateCards={updateCards} habit={habit} />)}
</ul>
}