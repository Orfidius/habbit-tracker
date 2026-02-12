import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "./store/hooks";
import { StyleSheet } from "react-native";

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
    <View style={styles.container}>
      {wins !== 0 && (
        <>
          <Text style={styles.statsText}>{wins}</Text>
          <Ionicons name="trophy-outline" size={32} color="#000" />
        </>
      )}
      {misses !== 0 && (
        <>
          <Text style={styles.statsText}>{misses}</Text>
          <Ionicons name="skull-outline" size={32} color="#000" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    padding: 0,
    margin: 0,
    columnGap: 12,
},
statsText: {
	fontSize: 34,
	fontWeight: '600',
} 

});
