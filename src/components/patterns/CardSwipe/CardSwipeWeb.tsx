// Web-specific implementation of card swipe
import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform, GestureResponderEvent, PanResponder } from 'react-native';
import { Text } from '../../Text';
import { useTheme } from '../../../contexts/ThemeContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Core layout constant - matching the native implementation
const CARD_ASPECT_RATIO = 1.5;

interface Card {
  id: number;
  title: string;
  color: string;
}

// Demo content - same as native implementation
const DEMO_CARDS: Card[] = [
  { id: 1, title: 'Swipe Right to Like', color: '#FF6B6B' },
  { id: 2, title: 'Swipe Left to Skip', color: '#4ECDC4' },
  { id: 3, title: 'Keep Going!', color: '#45B7D1' },
  { id: 4, title: 'Almost There...', color: '#96CEB4' },
  { id: 5, title: 'Last One!', color: '#FFEEAD' },
];

export const CardSwipeWeb = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState(DEMO_CARDS);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardRef = useRef<View>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Responsive layout calculations
  const [dimensions] = useState(() => {
    const window = Dimensions.get('window');
    const cardWidth = Math.min(window.width * 0.8, 400);
    return {
      screenWidth: window.width,
      cardWidth,
      swipeThreshold: window.width * 0.3,
    };
  });

  // Card transition handling
  const removeTopCard = () => {
    setCards(currentCards => currentCards.slice(1));
    translateX.value = 0;
    translateY.value = 0;
  };

  // Create a pan responder for handling gestures in a React Native friendly way
  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: () => {
        setIsDragging(true);
      },

      onPanResponderMove: (_, gestureState) => {
        // Update position based on gesture
        translateX.value = gestureState.dx;
        translateY.value = gestureState.dy;
      },

      onPanResponderRelease: (_, gestureState) => {
        setIsDragging(false);
        
        // Check if swipe was strong enough
        if (Math.abs(translateX.value) > dimensions.swipeThreshold) {
          // Swipe was strong enough - remove card
          const direction = Math.sign(translateX.value);
          translateX.value = withSpring(
            direction * dimensions.screenWidth * 1.5,
            {
              damping: 15,
              stiffness: 300,
              mass: 0.3,
            },
            () => {
              runOnJS(removeTopCard)();
            }
          );
        } else {
          // Return card to center
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
        }
      },

      onPanResponderTerminate: () => {
        setIsDragging(false);
        // Return card to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      },
    })
  ).current;

  // Add web-specific cursor styles via DOM when on web platform
  useEffect(() => {
    if (Platform.OS === 'web' && cardRef.current) {
      const element = cardRef.current as unknown as HTMLElement;
      if (element) {
        // Apply cursor style based on dragging state
        element.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    }
  }, [isDragging]);

  // Animation styles
  const rTopCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-dimensions.screenWidth / 2, 0, dimensions.screenWidth / 2],
      [8, 0, -8]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const rSecondCardStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      Math.abs(translateX.value),
      [0, dimensions.screenWidth],
      [0.9, 1]
    );

    return {
      transform: [{ scale }],
    };
  });

  if (cards.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Text style={[styles.noMoreCards, { color: theme.colors.text }]}>
            No more cards!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.cardContainer, { height: dimensions.cardWidth * CARD_ASPECT_RATIO }]}>
        {cards.length > 1 && (
          <Animated.View
            style={[
              styles.card,
              rSecondCardStyle,
              {
                backgroundColor: cards[1].color,
                width: dimensions.cardWidth,
                height: dimensions.cardWidth * CARD_ASPECT_RATIO,
                zIndex: 1, // Lower z-index for the card below
              },
            ]}
          >
            <Text style={styles.cardText}>{cards[1].title}</Text>
          </Animated.View>
        )}

        <Animated.View
          ref={cardRef}
          {...panResponder.panHandlers}
          style={[
            styles.card,
            rTopCardStyle,
            {
              backgroundColor: cards[0].color,
              width: dimensions.cardWidth,
              height: dimensions.cardWidth * CARD_ASPECT_RATIO,
              zIndex: 2, // Higher z-index for the top card
            },
          ]}
        >
          <Text style={styles.cardText}>{cards[0].title}</Text>
        </Animated.View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}>
        <Text style={[styles.instructions, { color: theme.colors.text }]}>
          ← Swipe cards left or right →
        </Text>
      </View>
    </View>
  );
};

// Styles - matching the native implementation
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    borderRadius: 20,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // Ensure proper stacking
    zIndex: 1,
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    padding: 20,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  instructions: {
    fontSize: 16,
    opacity: 0.7,
  },
  noMoreCards: {
    fontSize: 24,
    fontWeight: 'bold',
    opacity: 0.5,
  },
});
