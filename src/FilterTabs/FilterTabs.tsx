import dayjs from "dayjs";
import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Freq, setFreqFilter } from "../store/HabitState";
import styles from "./FilterTabs.module.scss";

const days: Record<string, string> = {
  Su: "Sunday",
  M: "Monday",
  Tu: "Tuesday",
  W: "Wednesday",
  Th: "Thursday",
  F: "Friday",
  Sa: "Saturday",
};

const daysEntries = Object.entries(days);
export const FilterTabs: FC = () => {
  const currentDay = dayjs().day();
  const dispatch = useDispatch();
  const mappedDays = daysEntries.map(([first, full], index) =>
    index === currentDay ? full : first,
  );
  useEffect(() => {
    const current = daysEntries.map(([key]) => key).at(currentDay);
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
