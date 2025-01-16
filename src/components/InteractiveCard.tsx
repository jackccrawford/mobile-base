import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  Platform,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../contexts/ThemeContext';

interface InteractiveCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  hapticFeedback?: boolean;
  animationPreset?: 'lift' | 'tilt' | 'scale';
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  onPress,
  style,
  hapticFeedback = true,
  animationPreset = 'lift',
}) => {
  const { theme } = useTheme();
  
  // Animation values
  const scale = new Animated.Value(1);
  const translateY = new Animated.Value(0);
  const rotateX = new Animated.Value(0);
  const rotateY = new Animated.Value(0);

  // Handle press animation
  const handlePressIn = useCallback(() => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, [hapticFeedback]);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Pan responder for tilt effect
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (animationPreset === 'tilt') {
          const { dx, dy } = gestureState;
          rotateX.setValue(dy / 10);
          rotateY.setValue(dx / 10);
        }
      },
      onPanResponderRelease: () => {
        if (animationPreset === 'tilt') {
          Animated.parallel([
            Animated.spring(rotateX, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.spring(rotateY, {
              toValue: 0,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const animatedStyle = {
    transform: [
      { scale },
      { translateY },
      {
        rotateX: rotateX.interpolate({
          inputRange: [-30, 30],
          outputRange: ['-30deg', '30deg'],
        }),
      },
      {
        rotateY: rotateY.interpolate({
          inputRange: [-30, 30],
          outputRange: ['-30deg', '30deg'],
        }),
      },
    ],
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...(Platform.OS === 'web' ? {} : panResponder.panHandlers)}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
          animatedStyle,
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    margin: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    backgroundColor: '#fff',
  },
});
