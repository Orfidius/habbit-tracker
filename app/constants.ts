import dayjs from "dayjs";

export const DAYS: Record<string, string> = {
  Su: "Sunday",
  M: "Monday",
  Tu: "Tuesday",
  W: "Wednesday",
  Th: "Thursday",
  F: "Friday",
  Sa: "Saturday",
};

export const DAYS_ENTRIES = Object.entries(DAYS);

export const TODAY = dayjs().day();

export const fontFamilys = {
  PLAYFAIR_DISPLAY: {
    normal: "PlayfairDisplayRegular",
    bold: "PlayfairDisplayBold",
  },
};
