import { View, Text } from "react-native";
import { App } from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { initDB } from "./repositories/habit-repository";
import { SplashScreen } from "expo-router";
import {
  useFonts,
  PlayfairDisplay_800ExtraBold,
} from "@expo-google-fonts/playfair-display";

// import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";
SplashScreen.preventAutoHideAsync();
export default function Index() {
  const [loaded, error] = useFonts({
    PlayfairDisplay_800ExtraBold,
  });

  useEffect(() => {
    (async () => {
      await initDB();
    })();
  }, []);

  useEffect(() => {
    console.log("batman", error, loaded);
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
        <App />
      </Provider>
    </>
  );
}
