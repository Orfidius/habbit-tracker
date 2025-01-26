import { View, Text } from "react-native";
import { App } from "./App";
import { Provider } from "react-redux";
import { store } from "./store";

export default function Index() {
  return (
    <>
      <Provider store={store}>
        <App />
      </Provider>
    </>
  );
}
