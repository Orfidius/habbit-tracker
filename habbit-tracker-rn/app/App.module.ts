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
    bottom: 20,
    width: 50,
    padding: 0,
    margin: 0,
  },
  add: {
    height: 50,
    right: 20,
    fontSize: 38,
    color: "#222",
    borderStyle: "solid",
    borderWidth: 4,
    borderColor: "#444",
    borderRadius: "5px",
    backgroundColor: "#eee",
  },
  edit: {
    height: 50,
    left: 20,
    fontSize: 38,
    color: "#222",
    borderColor: "#444",
    borderWidth: 4,
    borderStyle: "solid",
    borderRadius: 5,
    backgroundColor: "#eee",
  },
});
