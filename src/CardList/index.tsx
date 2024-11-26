import { FC, useEffect, useState } from "react";
import { getHabbits, Habbit } from "../repositories/habbit-repository";
import { Card } from "./Card";
import styles from './styles.module.scss';

type Props = {
    shouldReload: boolean;
}

export const Cardlist: FC<Props> = ({shouldReload}) => {
const [habbits, setHabbits] = useState<Array<Habbit>>([]);
useEffect(() => {
    getHabbits().then(habbits => {
        setHabbits(habbits);
    });
}, [shouldReload]);

return <ul className={styles.cardList}>
    {habbits.map(habbit => <Card habbit={habbit} />)}
</ul>
}