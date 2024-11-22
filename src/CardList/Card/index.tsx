import styles from './Card.module.scss';
import { FC } from "react";
import { Habbit } from "../../repositories/habbit-repository";

type Props = {
    habbit: Habbit;
}
export const Card: FC<Props> = ({habbit: {name, iteration, goal}}) => 
<li className={styles.card}>
    <h2>{name}</h2>
    <div className={styles.copy}>
        {/* TODO: Add "Last Updated" */}
        <p className={styles.numbersCopy}>
            <strong>Followed through on:</strong>
        </p>
        <p className={styles.numbers}>{iteration}/{goal}</p>
    </div>
</li> 