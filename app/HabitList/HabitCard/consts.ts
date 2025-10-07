import { type PresetConfig } from "react-native-animated-glow";
export const GLOW_CONFIG: PresetConfig = {
  metadata: {
    name: "My Cool Preset",
    textColor: "#FFFFFF",
    category: "Custom",
    tags: ["interactive"],
  },
  states: [
    {
      name: "default", // The base style for the component
      preset: {
        cornerRadius: 50,
        outlineWidth: 2,
        borderColor: "#E0FFFF",
        glowLayers: [
          { colors: ["#00BFFF", "#87CEEB"], opacity: 0.5, glowSize: 30 },
        ],
      },
    },
    // 2. Define interactive states
    {
      name: "hover",
      transition: 300, // 300ms transition into this state
      preset: {
        glowLayers: [{ glowSize: 40 }], // On hover, make the glow bigger
      },
    },
    {
      name: "press",
      transition: 100, // A faster transition for press
      preset: {
        glowLayers: [{ glowSize: 45, opacity: 0.6 }],
      },
    },
  ],
};
