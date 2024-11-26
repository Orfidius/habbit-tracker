import { createContext, FC, PropsWithChildren, useEffect, useRef, useState } from "react"
import styles from './style.module.scss';
import Fireworks, { FireworksHandlers } from "@fireworks-js/react";
import cx from 'classnames';

type Props = {

} & PropsWithChildren

type contextType = {
  setShowCelebrate: (value: boolean) => void;
}

type TimerReturn = ReturnType<typeof setTimeout>

export const celebrationContext = createContext<contextType>({ setShowCelebrate: () => undefined });

export const Celebration: FC<Props> = ({ children }) => {
  const [show, setShow] = useState(false);
  // const [closing, setClosing] = useState(true);
  const ref = useRef<FireworksHandlers>(null);
  const timerRef = useRef<TimerReturn | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    // if (ref.current.isRunning) {
    //   ref.current.stop()
    // } else {
      ref.current.start()
    // }
  }, [ref.current]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
   timerRef.current = setTimeout(() => {
      setShow(false);
    }, 3000);
  }, [show])

  return <>
    {show && <div className={styles.celebrationWrapper}>
    <h2>Well Done</h2>
    <div className={styles.fadein}>
      <Fireworks
          ref={ref}
          options={{ opacity: 0.5 }}
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'fixed',
            background: '#000'
          }}
        />
      </div>
    </div>}

    <celebrationContext.Provider value={{ setShowCelebrate: setShow }}  >
      {children}
    </celebrationContext.Provider>
  </>;
}    // "responsive": [    //   {    //     "maxWidth": 400,    //     "options": {    //       "particles": {    //         "move": {    //           "speed": {    //             "min": 33,    //             "max": 66    //           }    //         }    //       }    //     }    //   }    // ]  }};// const animaitionOptions: ISourceOptions = {//     "autoPlay": true,//     "background": {//       "color": {//         "value": "#000000"//       },//       "image": "",//       "position": "",//       "repeat": "",//       "size": "",//       "opacity": 1//     },//     "backgroundMask": {//       "composite": "destination-out",