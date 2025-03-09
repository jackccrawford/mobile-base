import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';
export type PaletteType = 'default' | 'ocean' | 'forest' | 'amber' | 'rose' | 'monochrome';

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
  paletteType?: PaletteType;
  // Keep bitcoinMode for backward compatibility
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
  paletteType: 'default',
  bitcoinMode: false,
};

// Define color palettes for both light and dark modes
const palettes = {
  default: {
    light: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#FFFFFF',
      text: '#000000',
      border: '#E5E5E5',
      success: '#4CAF50',
      error: '#F44336',
      info: '#2196F3',
      surface: '#FFFFFF',
      onSurface: '#000000',
      primaryContainer: '#E3F2FD',
      onPrimaryContainer: '#000000',
      outline: '#79747E',
      onSurfaceVariant: '#49454F',
    },
    dark: {
      primary: '#FFFFFF',
      secondary: '#5856D6',
      background: '#000000',
      text: '#FFFFFF',
      border: '#333333',
      success: '#4CAF50',
      error: '#F44336',
      info: '#2196F3',
      surface: '#121212',
      onSurface: '#FFFFFF',
      primaryContainer: '#1A237E',
      onPrimaryContainer: '#FFFFFF',
      outline: '#938F99',
      onSurfaceVariant: '#8E8E93',
    }
  },
  ocean: {
    light: {
      primary: '#0077B6',
      secondary: '#48CAE4',
      background: '#FFFFFF',
      text: '#000000',
      border: '#E5E5E5',
      success: '#4CAF50',
      error: '#F44336',
      info: '#90E0EF',
      surface: '#FFFFFF',
      onSurface: '#000000',
      primaryContainer: '#CAF0F8',
      onPrimaryContainer: '#03045E',
      outline: '#79747E',
      onSurfaceVariant: '#49454F',
    },
    dark: {
      primary: '#90E0EF',
      secondary: '#48CAE4',
      background: '#000000',
      text: '#FFFFFF',
      border: '#333333',
      success: '#4CAF50',
      error: '#F44336',
      info: '#0077B6',
      surface: '#121212',
      onSurface: '#FFFFFF',
      primaryContainer: '#0077B6',
      onPrimaryContainer: '#CAF0F8',
      outline: '#938F99',
      onSurfaceVariant: '#8E8E93',
    }
  },
  forest: {
    light: {
      primary: '#2D6A4F',
      secondary: '#40916C',
      background: '#FFFFFF',
      text: '#000000',
      border: '#E5E5E5',
      success: '#4CAF50',
      error: '#F44336',
      info: '#95D5B2',
      surface: '#FFFFFF',
      onSurface: '#000000',
      primaryContainer: '#D8F3DC',
      onPrimaryContainer: '#081C15',
      outline: '#79747E',
      onSurfaceVariant: '#49454F',
    },
    dark: {
      primary: '#95D5B2',
      secondary: '#40916C',
      background: '#000000',
      text: '#FFFFFF',
      border: '#333333',
      success: '#4CAF50',
      error: '#F44336',
      info: '#2D6A4F',
      surface: '#121212',
      onSurface: '#FFFFFF',
      primaryContainer: '#2D6A4F',
      onPrimaryContainer: '#D8F3DC',
      outline: '#938F99',
      onSurfaceVariant: '#8E8E93',
    }
  },
  amber: {
    light: {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      background: '#FFFFFF',
      text: '#000000',
      border: '#E5E5E5',
      success: '#4CAF50',
      error: '#F44336',
      info: '#FDE68A',
      surface: '#FFFFFF',
      onSurface: '#000000',
      primaryContainer: '#FEF3C7',
      onPrimaryContainer: '#78350F',
      outline: '#79747E',
      onSurfaceVariant: '#49454F',
    },
    dark: {
      primary: '#FDE68A',
      secondary: '#FBBF24',
      background: '#000000',
      text: '#FFFFFF',
      border: '#333333',
      success: '#4CAF50',
      error: '#F44336',
      info: '#F59E0B',
      surface: '#121212',
      onSurface: '#FFFFFF',
      primaryContainer: '#F59E0B',
      onPrimaryContainer: '#FEF3C7',
      outline: '#938F99',
      onSurfaceVariant: '#8E8E93',
    }
  },
  rose: {
    light: {
      primary: '#BE185D',
      secondary: '#DB2777',
      background: '#FFFFFF',
      text: '#000000',
      border: '#E5E5E5',
      success: '#4CAF50',
      error: '#F44336',
      info: '#FBCFE8',
      surface: '#FFFFFF',
      onSurface: '#000000',
      primaryContainer: '#FCE7F3',
      onPrimaryContainer: '#831843',
      outline: '#79747E',
      onSurfaceVariant: '#49454F',
    },
    dark: {
      primary: '#FBCFE8',
      secondary: '#DB2777',
      background: '#000000',
      text: '#FFFFFF',
      border: '#333333',
      success: '#4CAF50',
      error: '#F44336',
      info: '#FBCFE8',
      surface: '#121212',
      onSurface: '#FFFFFF',
      primaryContainer: '#9D174D',
      onPrimaryContainer: '#FCE7F3',
      outline: '#938F99',
      onSurfaceVariant: '#8E8E93',
    }
  },
  monochrome: {
    light: {
      primary: '#000000',
      secondary: '#333333',
      background: '#FFFFFF',
      text: '#000000',
      border: '#CCCCCC',
      success: '#333333',
      error: '#000000',
      info: '#666666',
      surface: '#FFFFFF',
      onSurface: '#000000',
      primaryContainer: '#EEEEEE',
      onPrimaryContainer: '#000000',
      outline: '#666666',
      onSurfaceVariant: '#333333',
    },
    dark: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      background: '#000000',
      text: '#FFFFFF',
      border: '#333333',
      success: '#CCCCCC',
      error: '#FFFFFF',
      info: '#999999',
      surface: '#121212',
      onSurface: '#FFFFFF',
      primaryContainer: '#333333',
      onPrimaryContainer: '#FFFFFF',
      outline: '#999999',
      onSurfaceVariant: '#CCCCCC',
    }
  }
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

  const getThemeColors = (mode: ThemeMode, systemIsDark: boolean, bitcoinMode: boolean, paletteType?: PaletteType) => {
    const isDark = mode === 'system' ? systemIsDark : mode === 'dark';
    const mode_key = isDark ? 'dark' : 'light';
    
    // Use default palette if paletteType is undefined
    const palette_key = paletteType || 'default';
    
    // Get colors from the palette
    let baseColors = palettes[palette_key][mode_key];
    
    // For backward compatibility with bitcoinMode
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
      colors: getThemeColors(theme.themeMode, systemIsDark, theme.bitcoinMode, theme.paletteType)
    };
    setThemeState(newTheme);
  }, [theme.themeMode, colorScheme, theme.bitcoinMode, theme.paletteType]);

  const setTheme = async (newTheme: Theme) => {
    try {
      // Use the paletteType from the newTheme, or default if undefined
      const paletteType = newTheme.paletteType || 'default';
      const mode = newTheme.dark ? 'dark' : 'light';
      
      // Save the theme without colors to avoid storing duplicate data
      const themeToSave = {
        ...newTheme,
        // We'll regenerate colors when loading the theme
        colors: {} 
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
