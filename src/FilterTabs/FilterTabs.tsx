import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Freq, setFreqFilter } from "../store/HabitState";
import styles from "./FilterTabs.module.scss";
import { TODAY, DAYS_ENTRIES } from "../constants";

export const FilterTabs: FC = () => {
  const dispatch = useDispatch();
  const mappedDays = DAYS_ENTRIES.map(([first, full], index) =>
    index === TODAY ? full : first,
  );
  useEffect(() => {
    const current = DAYS_ENTRIES.map(([key]) => key).at(TODAY);
    dispatch(setFreqFilter(current as Freq));
  }, []);
  return (
    <>
      <ul className={styles.container}>
        {mappedDays.map((el) => (
          <li>{el}</li>
        ))}
      </ul>
    </>
  );
};
