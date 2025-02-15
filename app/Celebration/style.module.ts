import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  celebrationWrapper: {
    display: "flex",
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    zIndex: 999,
  },
  header2: {
    position: "absolute",
    top: "40%",
    color: "#fff",
    width: "100%",
    textAlign: "center",
    zIndex: 999,
    fontSize: 45,
    textTransform: "uppercase",
  },
  celebrationContainer: {
    position: "absolute",
    flex: 1,
    top: 0,
    left: 0,
    zIndex: 99,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
});
