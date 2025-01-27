import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "#222",
    flexDirection: "row",
    position: "relative",
    // margin: -14px -14px 0 -14px;?
    // margin: -14,
    marginBottom: 0,
    padding: 0,
    justifyContent: "center",
    color: "#eee",
    width: "100%",
  },
  list: {
    display: "flex",
    flexDirection: "row",
  },
  listItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderStyle: "solid",
    borderRightColor: "#fff",
    color: "#fff",
  },
  listText: {
    color: "white",
    fontSize: 20,
    // fontColor: "#fff",
    // textColor: "#fff",
  },
  selected: {
    // borderBottom: "solid #fff 1px",
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderBottomColor: "#fff",
  },
  firstOfType: {
    // borderLeft: "solid #fff 1px",
    borderLeftWidth: 1,
    borderStyle: "solid",
    borderBottomColor: "#fff",
  },
});
