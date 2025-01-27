import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  paragraph: {
    margin: 0,
    padding: 0,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    // padding: 5,
    // columnGap: 5,
    height: "100%",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    rowGap: "15px",
  },
  FAB: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    width: 65,
    padding: 0,
    margin: 0,
  },
  add: {
    height: 65,
    right: 20,
    fontSize: 38,
    color: "#222",
    borderStyle: "solid",
    borderWidth: 4,
    borderColor: "#444",
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  edit: {
    height: 65,
    left: 20,
    fontSize: 38,
    color: "#222",
    borderColor: "#444",
    borderWidth: 4,
    borderStyle: "solid",
    borderRadius: 10,
    backgroundColor: "#eee",
  },
});
