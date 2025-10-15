import { type PresetConfig } from "react-native-animated-glow";
export const GLOW_CONFIG: PresetConfig = {
  states: [
    {
      name: "default",
      preset: {
        cornerRadius: 14,
        outlineWidth: 4,
        borderColor: [
          "rgba(238, 255, 0, 1)",
          "rgba(79, 255, 0, 1)",
          "rgba(46, 90, 255, 1)",
          "rgba(254, 0, 255, 1)",
          "rgba(231, 23, 23, 1)",
        ],
        // backgroundColor: "rgba(10, 10, 10, 1)",
        animationSpeed: 1.2,
        borderSpeedMultiplier: 1,
        glowLayers: [
          {
            glowPlacement: "behind",
            colors: [
              "rgba(205, 201, 35, 1)",
              "rgba(0, 255, 79, 1)",
              "rgba(0, 119, 255, 1)",
              "rgba(239, 0, 255, 1)",
              "rgba(222, 28, 28, 1)",
            ],
            glowSize: 34,
            opacity: 0.2,
            speedMultiplier: 1,
            coverage: 1,
            relativeOffset: 0,
          },
          {
            glowPlacement: "behind",
            colors: [
              "rgba(185, 182, 32, 1)",
              "rgba(0, 255, 79, 1)",
              "rgba(0, 119, 255, 1)",
              "rgba(239, 0, 255, 1)",
              "rgba(222, 28, 28, 1)",
            ],
            glowSize: 6,
            opacity: 0.5,
            speedMultiplier: 1,
            coverage: 1,
            relativeOffset: 0,
          },
          {
            glowPlacement: "behind",
            colors: ["#FFFFFF"],
            glowSize: [2, 8, 8, 2],
            opacity: 0.2,
            speedMultiplier: 2,
            coverage: 0.5,
            relativeOffset: 0,
          },
        ],
      },
    },
  ],
};
