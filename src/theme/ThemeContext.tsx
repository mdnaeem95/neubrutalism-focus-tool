import React, { createContext, useContext, ReactNode } from 'react';
import { lightColors, darkColors, ColorPalette } from './colors';
import { useStore } from '../stores';

const ThemeContext = createContext<ColorPalette>(lightColors);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const darkMode = useStore((s) => s.darkMode);
  const palette = darkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={palette}>{children}</ThemeContext.Provider>
  );
}

export function useColors(): ColorPalette {
  return useContext(ThemeContext);
}
