import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Freq, setFreqFilter } from "../store/HabitState";
import { styles } from "./FilterTabs.module";
import { TODAY, DAYS_ENTRIES } from "../constants";
import { useAppSelector } from "../store/hooks";
import { TouchableOpacity, View, Text } from "react-native";

export const FilterTabs: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const current = DAYS_ENTRIES.map(([key]) => key).at(TODAY);
    dispatch(setFreqFilter(current as Freq));
  }, []);

  const onFilterHandler = (val: Freq) => {
    dispatch(setFreqFilter(val));
  };
  return (
    <View style={styles.container}>
      {DAYS_ENTRIES.map(([first, full], index) => (
        <>
          <DayItem
            verbiage={index === TODAY ? full : first}
            onFilterHandler={onFilterHandler}
            freqKey={first as Freq}
            key={`${first}-${full}`}
          />
        </>
      ))}
    </View>
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
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => onFilterHandler(freqKey)}
    >
      <Text style={[styles.listText, ...(isSelected ? [styles.selected] : [])]}>
        {verbiage}
      </Text>
    </TouchableOpacity>
  );
};
