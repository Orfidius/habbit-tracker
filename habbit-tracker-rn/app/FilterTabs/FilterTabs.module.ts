import { StyleSheet } from "react-native";
StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "#222",
    flexDirection: "row",
    position: "relative",
    margin: 14,
    marginBottom: 0,
    padding: 0,
    justifyContent: "center",
    color: "#eee",
  },
  listItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderStyle: "solid",
    borderRightColor: "#fff",
  },
  selected: {
    borderBottom: "solid #fff 1px",
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderBottomColor: "#fff",
  },
  firstOfType: {
    borderLeft: "solid #fff 1px",
  },
});
