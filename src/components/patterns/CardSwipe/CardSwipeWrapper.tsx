import React from 'react';
import { Platform } from 'react-native';
import { CardSwipeDemo } from './CardSwipeDemo';
import { CardSwipeWeb } from './CardSwipeWeb';

export const CardSwipeWrapper = () => {
  // Use platform-specific implementation
  if (Platform.OS === 'web') {
    return <CardSwipeWeb />;
  }
  
  // Use the existing native implementation for iOS and Android
  return <CardSwipeDemo />;
};
