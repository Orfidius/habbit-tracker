import { FC, useEffect, useState } from "react";
import { Card } from "./Card";
import styles from './styles.module.scss';
import { gethabits, habit } from "../repositories/habit-repository";

type Props = {
    habits: Array<habit>;
    updateCards: () => Promise<void>;
}

export const Cardlist: FC<Props> = ({habits, updateCards}) => {

return <ul className={styles.cardList}>
    {habits.map(habit => <Card updateCards={updateCards} habit={habit} />)}
</ul>
}