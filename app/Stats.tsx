import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type StatsProps = {
  misses: number;
  wins: number;
};

// TODO: Pull misses and wins from DB
export const Stats: React.FC<StatsProps> = ({ misses, wins }) => {
  return (
    <View>
      <Ionicons name="skull-outline" size={32} color="#000" />
      <Ionicons name="trophy-outline" size={32} color="#000" />
    </View>
  );
};
