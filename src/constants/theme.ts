'use client'
import { createTheme,   DEFAULT_THEME,} from "@mantine/core";
import { Manrope } from "next/font/google";
//import { generateColors } from '@mantine/colors-generator';

const manropeSans = Manrope({
    variable: "--font-manrope-sans",
    subsets: ["latin"],
  });

export const theme = createTheme({
  /** Your theme override here */
  fontSizes: {
    xs: "10px",
    sm: "11px",
    md: "14px",
    lg: "16px",
    xl: "20px",
  },
   breakpoints: {
    xs: '30em', //576px,
    sm: '48em', // 768px
    md: '64em', // 992px
    lg: '74em', // 1200px
    xl: '90em', // 1408px
  },
  fontFamily: `${manropeSans.style.fontFamily}, ${DEFAULT_THEME.fontFamily}`,
  primaryColor: "m-orange",
  primaryShade: { light: 6, dark: 9 },
  colors: {
    "m-gray": ["#f2f4fb", "#e6e6e9", "#cbcbce", "#aeafb3", "#95969c", "#85878f", "#5e616c", "#6a6d77", "#5e616c", "#f2f4fb", ],
    "m-cyan": ["#e5faff", "#d5eff8", "#b2dded", "#84c7e1", "#62b6d7", "#4bacd1", "#b2dded", "#2b92b8", "#1a82a5", "#3ca7cf", ], 
    "m-orange": ["#ffe8e6", "#ffd1cd", "#ffa19a", "#ff6e64", "#ff1708", "#ff2818", "#ff594d", "#e40600", "#cc0000", "#b20000", ],
    "m-blue": [ "#f0f2fa", "#dde0ee", "#b7bedf", "#8f9ad0", "#6d7bc3", "#5867bc", "#283779", "#3e4ea4", "#364593", "#4c5eba", ],
    "m-background": ["#f2f4fb", "#e6e6e9", "#cbcbce", "#aeafb3", "#95969c", "#85878f", "#ffffff", "#ededed", "#5e616c", "#0a0a0a", ],
  },

  /*   variantColorResolver: (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input);
  
  const parsedColor = parseThemeColor({
    color: input.color || input.theme.primaryColor,
    theme: input.theme,
  });

  // Override some properties for variant
  if (parsedColor.isThemeColor && parsedColor.color === 'lime' && input.variant === 'filled') {
    return {
      ...defaultResolvedColors,
      color: 'var(--mantine-color-black)',
      hoverColor: 'var(--mantine-color-black)',
    };
  }

  // Completely override variant
  if (input.variant === 'light') {
    return {
      background: rgba(parsedColor.value, 0.1),
      hover: rgba(parsedColor.value, 0.15),
      border: `1px solid ${parsedColor.value}`,
      color: darken(parsedColor.value, 0.1),
    };
  }

  if (input.variant === 'outline') {
    console.log("hundred:", parsedColor)
    return {
      background: 'var(--mantine-color-red-5)',
      hover: rgba(parsedColor.value, 0.15),
      border: `1px solid ${rgba(parsedColor.value, 0.5)}`,
      color: darken(parsedColor.value, 0.1),
    };
  }

  // Add new variants support
  if (input.variant === 'danger') {
    return {
      background: 'var(--mantine-color-red-9)',
      hover: 'var(--mantine-color-red-8)',
      color: 'var(--mantine-color-white)',
      border: 'none',
    };
  }

  return defaultResolvedColors;
} */
});