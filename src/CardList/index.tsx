import { FC, useEffect, useState } from "react";
import { getHabbits, Habbit } from "../repositories/habbit-repository";
import { Card } from "./Card";


export const Cardlist: FC = () => {
const [habbits, setHabbits] = useState<Array<Habbit>>([]);
useEffect(() => {
    getHabbits().then(habbits => {
        setHabbits(habbits);
    });
}, []);

return <>
{habbits.map(habbit => <Card habbit={habbit} />)}
</>
}