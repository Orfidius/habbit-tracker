import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  //   opening: {
  //     top: 5,
  //     // animationName: 'on-load',
  //     // animationDuration: 1,
  //   },
  //   closing: {
  //     top: 5,
  // animationName: 'on-close',
  // animationDuration: 1,
  // },
  // onLoad: {
  //   from: {
  //     transform: [{ translateY: -100 }],
  //   },
  //   to: {
  //     transform: [{ translateY: -5 }],
  //   },
  // },
  // onClose: {
  //   from: {
  //     transform: [{ translateY: -5 }],
  //   },
  //   to: {
  //     transform: [{ translateY: -100 }],
  //   },
  // },
  AddModal: {
    backgroundColor: "#413952",
    height: "100%",
    // top: "50%",
    marginTop: 70,
    marginHorizontal: 5,
    // width: 'calc(100% - 10px)',
    // position: "absolute",
    borderRadius: 10,
    // padding: 0.5rem 15px 0 15px,
    // boxShadow: "-10px 15px 2px #333",
    // animationDuration: 1,
  },
  Button: {
    borderRadius: 0,
    textTransform: "uppercase",
    padding: 10,
    width: 100,
    display: "flex",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    columnGap: 10,
  },
  TextInput: {
    display: "flex",
    flexDirection: "column",
    color: "#eee",
    marginBottom: 1,
    textTransform: "capitalize",
    // Label: {},
  },
  frequency: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 100,
    justifyContent: "center",
    // RowGap: 0.5,
  },
  textWrapper: {
    textAlign: "center",
    width: "100%",
  },
  checkbox: {
    // font: "inherit",
    color: "currentColor",
    width: 25,
    height: 25,
    borderRadius: 0.15,
    transform: [{ translateY: -0.075 }],
  },
  buttonStyles: {
    width: "100%",
    // border: 0,
    backgroundColor: "#222",
    color: "#ccc",
    padding: 0.5,
    textTransform: "uppercase",
    fontSize: 16,
    fontWeight: 600,
  },
});
