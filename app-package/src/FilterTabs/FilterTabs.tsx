import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Freq, setFreqFilter } from "../store/HabitState";
import styles from "./FilterTabs.module.scss";
import { TODAY, DAYS_ENTRIES } from "../constants";
import { useAppSelector } from "../store/hooks";
import cx from "classnames";
export const FilterTabs: FC = () => {
  const dispatch = useDispatch();
  // const mappedDays = DAYS_ENTRIES.map(([first, full], index) =>
  //   index === TODAY ? full : first,
  // ) as Array<Freq>;
  useEffect(() => {
    const current = DAYS_ENTRIES.map(([key]) => key).at(TODAY);
    dispatch(setFreqFilter(current as Freq));
  }, []);

  const onFilterHandler = (val: Freq) => {
    console.log(val);
    dispatch(setFreqFilter(val));
  };
  return (
    <>
      <ul className={styles.container}>
        {DAYS_ENTRIES.map(([first, full], index) => (
          <DayItem
            verbiage={index === TODAY ? full : first}
            onFilterHandler={onFilterHandler}
            freqKey={first as Freq}
          />
        ))}
      </ul>
    </>
  );
};

const DayItem: FC<{
  freqKey: Freq;
  verbiage: string;
  onFilterHandler: (val: Freq) => void;
}> = ({ verbiage, onFilterHandler, freqKey }) => {
  const currentFilter = useAppSelector((state) => state.habitState.freqFilter);
  const isSelected = (() => {
    if (currentFilter.length === 2) {
      verbiage.slice(0, 2) === currentFilter;
      return verbiage.slice(0, 2) === currentFilter;
    } else {
      return verbiage.at(0) === currentFilter;
    }
    return false;
  })();
  return (
    <li
      onClick={() => onFilterHandler(freqKey)}
      onTouchStart={() => onFilterHandler(freqKey)}
    >
      <span className={cx(isSelected && styles.selected)}>{verbiage}</span>
    </li>
  );
};
