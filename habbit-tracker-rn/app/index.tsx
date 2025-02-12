import { View, Text } from "react-native";
import { App } from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { initDB } from "./repositories/habit-repository";

export default function Index() {
  useEffect(() => {
    (async () => {
      await initDB();
    })();
  }, []);
  return (
    <>
      <Provider store={store}>
        <App />
      </Provider>
    </>
  );
}
