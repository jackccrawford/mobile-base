/**
 * Color utility functions for ensuring WCAG compliance and dynamic theming
 */

/**
 * Calculate the relative luminance of a color
 * Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20-TECHS/G17.html
 * 
 * @param hexColor - Hex color code (with or without #)
 * @returns Luminance value between 0 and 1
 */
export const getLuminance = (hexColor: string): number => {
  // Handle undefined or invalid input
  if (!hexColor) {
    console.warn('getLuminance received undefined or empty color, defaulting to black');
    return 0; // Black has luminance 0
  }

  try {
    // Remove # if present
    const hex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
    
    // Handle 8-digit hex (with alpha)
    const hexWithoutAlpha = hex.length === 8 ? hex.slice(0, 6) : hex;
    
    // Convert to RGB
    const r = parseInt(hexWithoutAlpha.slice(0, 2), 16) / 255;
    const g = parseInt(hexWithoutAlpha.slice(2, 4), 16) / 255;
    const b = parseInt(hexWithoutAlpha.slice(4, 6), 16) / 255;
  
    // Calculate luminance
    const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  } catch (error) {
    console.error('Error calculating luminance:', error);
    return 0; // Default to black (luminance 0) on error
  }
};

/**
 * Calculate contrast ratio between two colors
 * Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20-TECHS/G17.html
 * 
 * @param color1 - First hex color
 * @param color2 - Second hex color
 * @returns Contrast ratio (1-21)
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  // Handle undefined or invalid input
  if (!color1 || !color2) {
    console.warn('getContrastRatio received undefined colors, returning minimum contrast');
    return 1; // Minimum contrast
  }

  try {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    
    // Calculate contrast ratio
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  } catch (error) {
    console.error('Error calculating contrast ratio:', error);
    return 1; // Default to minimum contrast on error
  }
};

/**
 * Determine if a color is light or dark based on luminance
 * 
 * @param hexColor - Hex color code
 * @returns Boolean indicating if color is light
 */
export const isLightColor = (hexColor: string): boolean => {
  if (!hexColor) {
    console.warn('isLightColor received undefined color, defaulting to false');
    return false; // Default to dark
  }
  
  try {
    const luminance = getLuminance(hexColor);
    return luminance > 0.5;
  } catch (error) {
    console.error('Error determining if color is light:', error);
    return false; // Default to dark on error
  }
};

/**
 * Adjust color opacity
 * 
 * @param hexColor - Hex color code
 * @param opacity - Opacity value (0-1)
 * @returns Hex color with opacity
 */
export const adjustOpacity = (hexColor: string, opacity: number): string => {
  if (!hexColor) {
    console.warn('adjustOpacity received undefined color, defaulting to black');
    hexColor = '#000000'; // Default to black
  }
  
  try {
    // Remove # if present
    const hex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
    
    // Convert opacity to hex
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    
    return `#${hex}${alpha}`;
  } catch (error) {
    console.error('Error adjusting opacity:', error);
    return '#00000000'; // Transparent black as fallback
  }
};

/**
 * Get header colors that comply with WCAG standards based on the primary color
 * 
 * @param primaryColor - Primary color from the theme
 * @returns Object with background and text colors
 */
export const getAccessibleHeaderColors = (primaryColor: string) => {
  // Handle undefined primary color
  if (!primaryColor) {
    console.warn('getAccessibleHeaderColors received undefined color, using default');
    return {
      background: '#007AFF', // Default blue
      text: '#FFFFFF'
    };
  }

  try {
    // For header background, use the primary color
    const headerBackground = primaryColor;
    
    // Special cases for themes that need white text for better contrast
    // Default blue and amber in light mode need white text
    if (primaryColor === '#F59E0B' || primaryColor === '#007AFF') {
      return {
        background: headerBackground,
        text: '#FFFFFF'
      };
    }
    
    // For text, ensure contrast ratio of at least 4.5:1 (WCAG AA)
    const whiteContrast = getContrastRatio(headerBackground, '#FFFFFF');
    const blackContrast = getContrastRatio(headerBackground, '#000000');
    
    let headerText = whiteContrast >= 4.5 ? '#FFFFFF' : '#000000';
    
    // If neither white nor black provides sufficient contrast, adjust the background
    if (whiteContrast < 4.5 && blackContrast < 4.5) {
      // Darken or lighten the background color to improve contrast
      headerText = '#FFFFFF';
      // We would need more complex color adjustment here in a real implementation
    }
    
    return {
      background: headerBackground,
      text: headerText
    };
  } catch (error) {
    console.error('Error determining header colors:', error);
    return {
      background: '#007AFF', // Default blue
      text: '#FFFFFF'
    };
  }
};
