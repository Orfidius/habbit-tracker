import { View, Text } from "react-native";
import { App } from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect, useLayoutEffect } from "react";
import { initHabitTable, seedDB } from "./repositories/habit-repository";
import { SplashScreen } from "expo-router";
import {
  useFonts,
  PlayfairDisplay_800ExtraBold,
} from "@expo-google-fonts/playfair-display";
import { RubikDirt_400Regular } from "@expo-google-fonts/rubik-dirt";
import { initStatsTable } from "./repositories/stats-repository";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";
SplashScreen.preventAutoHideAsync();
export default function Index() {
  const [loaded, error] = useFonts({
    PlayfairDisplay_800ExtraBold,
    RubikDirt_400Regular,
  });

  useLayoutEffect(() => {
    initHabitTable();
    initStatsTable();
    seedDB();
  }, []);
  useEffect(() => {
    (async () => {
      console.log("Initializing DB");
      console.log("Seeding DB");
    })();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && error) {
    return null;
  }
  return (
    <>
      <Provider store={store}>
        {/*Add Tanstack queryt here
         */}
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </>
  );
}
