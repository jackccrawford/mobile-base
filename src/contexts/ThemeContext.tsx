import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
    success: string;
    error: string;
    info: string;
    // MD3 colors
    surface: string;
    onSurface: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    outline: string;
    onSurfaceVariant: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  dark: boolean;
  themeMode: ThemeMode;
  headerTitle: string;
  bitcoinMode: boolean;
}

const defaultTheme: Theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    text: '#000000',
    border: '#E5E5E5',
    success: '#4CAF50',
    error: '#F44336',
    info: '#2196F3',
    // MD3 colors
    surface: '#FFFFFF',
    onSurface: '#000000',
    primaryContainer: '#E3F2FD',
    onPrimaryContainer: '#000000',
    outline: '#79747E',
    onSurfaceVariant: '#49454F',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  dark: false,
  themeMode: 'system',
  headerTitle: 'Mobile Base',
  bitcoinMode: false,
};

const darkThemeColors = {
  ...defaultTheme.colors,
  background: '#000000',
  text: '#FFFFFF',
  surface: '#121212',
  onSurface: '#FFFFFF',
  primary: '#FFFFFF',
  onSurfaceVariant: '#8E8E93',
  primaryContainer: '#1A237E',
  onPrimaryContainer: '#FFFFFF',
  outline: '#938F99',
};

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setHeaderTitle: (title: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeState(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const getThemeColors = (mode: ThemeMode, systemIsDark: boolean, bitcoinMode: boolean) => {
    const isDark = mode === 'system' ? systemIsDark : mode === 'dark';
    const baseColors = isDark ? darkThemeColors : defaultTheme.colors;

    if (!isDark && bitcoinMode) {
      return {
        ...baseColors,
        primary: '#f7931a'  // Bitcoin orange in light mode only
      };
    }

    return baseColors;
  };

  useEffect(() => {
    const systemIsDark = colorScheme === 'dark';
    const isDark = theme.themeMode === 'system' ? systemIsDark : theme.themeMode === 'dark';
    
    const newTheme = {
      ...theme,
      dark: isDark,
      colors: getThemeColors(theme.themeMode, systemIsDark, theme.bitcoinMode)
    };
    setThemeState(newTheme);
  }, [theme.themeMode, colorScheme, theme.bitcoinMode]);

  const setTheme = async (newTheme: Theme) => {
    try {
      const themeToSave = {
        ...newTheme,
        colors: newTheme.dark ? darkThemeColors : defaultTheme.colors
      };
      await AsyncStorage.setItem('theme', JSON.stringify(themeToSave));
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    const newTheme = { ...theme, themeMode: mode };
    setTheme(newTheme);
  };

  const setHeaderTitle = async (title: string) => {
    const newTheme = { ...theme, headerTitle: title };
    setTheme(newTheme);
  };

  const contextValue = {
    theme,
    setTheme,
    setThemeMode,
    setHeaderTitle,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
