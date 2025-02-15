import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { Text, View } from "react-native";
import { styles } from "./style.module";
import LottieView from "lottie-react-native";
type Props = {} & PropsWithChildren;

type contextType = {
  setShowCelebrate: (value: boolean) => void;
};

type TimerReturn = ReturnType<typeof setTimeout>;

export const celebrationContext = createContext<contextType>({
  setShowCelebrate: () => undefined,
});

export const Celebration: FC<Props> = ({ children }) => {
  const [show, setShow] = useState(false);
  const timerRef = useRef<TimerReturn | null>(null);
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setShow(false);
    }, 3000);
  }, [show]);
  console.log("batman", show);
  return (
    <>
      {show && (
        <View style={styles.celebrationContainer}>
          <Text style={styles.header2}>Well Done</Text>
          {
            <LottieView
              style={{
                flex: 1,
                height: "100%",
                width: "100%",
              }}
              source={require("../../assets/images/fireworks.json")}
              autoPlay
              loop
            />
          }
        </View>
      )}
      <celebrationContext.Provider value={{ setShowCelebrate: setShow }}>
        {children}
      </celebrationContext.Provider>
    </>
  );
}; // "responsive": [    //   {    //     "maxWidth": 400,    //     "options": {    //       "particles": {    //         "move": {    //           "speed": {    //             "min": 33,    //             "max": 66    //           }    //         }    //       }    //     }    //   }    // ]  }};// const animaitionOptions: ISourceOptions = {//     "autoPlay": true,//     "background": {//       "color": {//         "value": "#000000"//       },//       "image": "",//       "position": "",//       "repeat": "",//       "size": "",//       "opacity": 1//     },//     "backgroundMask": {//       "composite": "destination-out",
