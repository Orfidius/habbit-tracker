import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "./store/hooks";

type StatsProps = {
  misses: number;
  wins: number;
};

// TODO: Pull misses and wins from DB
export const Stats: React.FC = () => {
  const [wins, misses] = useAppSelector((state) => [
    state.habitState.wins,
    state.habitState.misses,
  ]);
  return (
    <View>
      {wins !== 0 && (
        <>
          <Text>{wins}</Text>
          <Ionicons name="trophy-outline" size={32} color="#000" />
        </>
      )}
      {misses !== 0 && (
        <>
          <Text>{misses}</Text>
          <Ionicons name="skull-outline" size={32} color="#000" />
        </>
      )}
    </View>
  );
};
