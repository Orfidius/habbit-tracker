import { StyleSheet } from 'react-native';

const AddModalStyles = StyleSheet.create({
  opening: {
    top: 5,
    animationName: 'on-load',
    animationDuration: 1,
  },
  closing: {
    top: 5,
    animationName: 'on-close',
    animationDuration: 1,
  },
  onLoad: {
    from: {
      transform: [{ translateY: -100 }],
    },
    to: {
      transform: [{ translateY: -5 }],
    },
  },
  onClose: {
    from: {
      transform: [{ translateY: -5 }],
    },
    to: {
      transform: [{ translateY: -100 }],
    },
  },
  AddModal: {
    backgroundColor: '#413952',
    height: '100%',
    width: 'calc(100% - 10px)',
    position: 'absolute',
    left: 5,
    borderRadius: 10,
    padding: 0.5rem 15px 0 15px,
    boxShadow: '-10px 15px 2px #333',
    animationDuration: 1,
  },
  buttonWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    columnGap: 10,
    Button: {
      borderRadius: 0,
      textTransform: 'uppercase',
      padding: 10,
      width: 100,
      display: 'block',
    },
  },
  TextInput: {
    display: 'flex',
    flexDirection: 'column',
    color: '#eee',
    marginBottom: 1,
    textTransform: 'capitalize',
    Label: {},
  },
  frequency: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 100,
    justifyContent: 'center',
    RowGap: 0.5,
    p: {
      textAlign: 'center',
      width: '100%',
    },
    checkbox: {
      font: 'inherit',
      color: 'currentColor',
      width: 25,
      height: 25,
      borderRadius: 0.15,
      transform: [{ translateY: -0.075 }],
    },
    Button: {
      width: '100%',
      border: 0,
      backgroundColor: '#222',
      color: '#ccc',
      padding: 0.5,
      textTransform: 'uppercase',
      fontSize: 16,
      fontWeight: 600,
    },
  },
});

export default AddModalStyles;
