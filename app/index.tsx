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

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [loaded, error] = useFonts({
    PlayfairDisplay_800ExtraBold,
    RubikDirt_400Regular,
  });

  useEffect(() => {
	  console.log('useEffect from index.tsx')
  })
  useLayoutEffect(() => {
    console.log('Running useLayoutEffect')
    const initializeDatabase = async () => {
      try {
        console.log("Initializing DB");
        await initHabitTable();
        // await initStatsTable();
        await seedDB();
        console.log("DB initialized successfully");
      } catch (e) {
        console.error("Failed to initialize database", e);
      }
    };
    initializeDatabase();
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
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </>
  );
}
