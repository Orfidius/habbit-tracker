import { FC, useEffect, useState } from "react";
import { getHabbits, Habbit } from "../repositories/habbit-repository";
import { Card } from "./Card";
import styles from 'styles.module.scss';



export const Cardlist: FC = () => {
const [habbits, setHabbits] = useState<Array<Habbit>>([]);
useEffect(() => {
    getHabbits().then(habbits => {
        setHabbits(habbits);
    });
}, []);

return <ul className={styles.cardList}>
    {habbits.map(habbit => <Card habbit={habbit} />)}
</ul>
}