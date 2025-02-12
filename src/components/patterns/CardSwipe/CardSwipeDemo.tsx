// [AI-FREEZE] Card swipe interaction pattern implementation
// Following standard swipe gesture patterns with proper animation timing
import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform, GestureResponderEvent } from 'react-native';
import { Text } from '../../Text';
import { useTheme } from '../../../contexts/ThemeContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// [AI-FREEZE] Core layout constant
const CARD_ASPECT_RATIO = 1.5;

interface Card {
  id: number;
  title: string;
  color: string;
}

// [AI-MUTABLE] Demo content - can be modified for testing
const DEMO_CARDS: Card[] = [
  { id: 1, title: 'Swipe Right to Like', color: '#FF6B6B' },
  { id: 2, title: 'Swipe Left to Skip', color: '#4ECDC4' },
  { id: 3, title: 'Keep Going!', color: '#45B7D1' },
  { id: 4, title: 'Almost There...', color: '#96CEB4' },
  { id: 5, title: 'Last One!', color: '#FFEEAD' },
];

// [AI-FREEZE] Core swipe interaction implementation
// Carefully tuned animation and interaction parameters
export const CardSwipeDemo = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [cards, setCards] = React.useState(DEMO_CARDS);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardRef = useRef<View>(null);
  const [cardPosition, setCardPosition] = React.useState({ x: 0, y: 0 });

  // [AI-FREEZE] Responsive layout calculations
  const [dimensions, setDimensions] = React.useState(() => {
    const window = Dimensions.get('window');
    const cardWidth = Math.min(window.width * 0.8, 400);
    return {
      screenWidth: window.width,
      cardWidth,
      swipeThreshold: window.width * 0.3,
    };
  });

  // Handle window resize on web
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const handleResize = () => {
        const window = Dimensions.get('window');
        const cardWidth = Math.min(window.width * 0.8, 400);
        setDimensions({
          screenWidth: window.width,
          cardWidth,
          swipeThreshold: window.width * 0.3,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Update card position when mounted or resized
  React.useEffect(() => {
    if (Platform.OS === 'web' && cardRef.current) {
      const updateCardPosition = () => {
        const element = cardRef.current as unknown as HTMLElement;
        if (element) {
          const rect = element.getBoundingClientRect();
          setCardPosition({ x: rect.left, y: rect.top });
        }
      };

      updateCardPosition();
      window.addEventListener('resize', updateCardPosition);
      return () => window.removeEventListener('resize', updateCardPosition);
    }
  }, [dimensions]);

  // [AI-MUTABLE] Card transition handling
  const removeTopCard = React.useCallback(() => {
    setCards(currentCards => currentCards.slice(1));
    translateX.value = 0;
    translateY.value = 0;
  }, [translateX, translateY]);

  interface GestureContext {
    startX: number;
    startY: number;
  }

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, {
    startX: number;
    startY: number;
  }>({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    onEnd: (event) => {
      if (Math.abs(translateX.value) > dimensions.swipeThreshold) {
        // Animate card off screen first
        translateX.value = withSpring(
          Math.sign(translateX.value) * dimensions.screenWidth * 1.5,
          {
            damping: 15,
            stiffness: 300,
            mass: 0.3,
          },
          (finished) => {
            if (finished) {
              runOnJS(removeTopCard)();
            }
          }
        );
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  // Web touch handlers
  const handleTouchStart = React.useCallback((e: React.TouchEvent | GestureResponderEvent) => {
    if (Platform.OS === 'web') {
      const webEvent = e as React.TouchEvent;
      const touch = webEvent.touches[0];
      const touchX = touch.clientX - cardPosition.x;
      const touchY = touch.clientY - cardPosition.y;

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          const deltaX = touch.clientX - cardPosition.x - touchX;
          const deltaY = touch.clientY - cardPosition.y - touchY;
          translateX.value = deltaX;
          translateY.value = deltaY;
        }
      };

      const handleTouchEnd = () => {
        if (Math.abs(translateX.value) > dimensions.swipeThreshold) {
          translateX.value = withSpring(
            Math.sign(translateX.value) * dimensions.screenWidth * 1.5,
            {},
            () => removeTopCard()
          );
        } else {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
        }
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      // Clean up previous listeners if they exist
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

      // Add new listeners
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      // Clean up on component unmount or when dependencies change
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [cardPosition, dimensions.screenWidth, dimensions.swipeThreshold, removeTopCard, translateX, translateY]);

  // Add cleanup effect
  React.useEffect(() => {
    const cleanup = () => {
      // Note: We can't actually get all listeners from the document
      // So we'll just ensure our specific handlers are removed
      if (Platform.OS === 'web') {
        const element = cardRef.current as unknown as HTMLElement;
        if (element) {
          element.removeEventListener('touchstart', handleTouchStart as unknown as EventListener);
        }
      }
    };

    return cleanup;
  }, [handleTouchStart]);

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
              },
            ]}
          >
            <Text style={styles.cardText}>{cards[1].title}</Text>
          </Animated.View>
        )}

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              styles.card,
              rTopCardStyle,
              {
                backgroundColor: cards[0].color,
                width: dimensions.cardWidth,
                height: dimensions.cardWidth * CARD_ASPECT_RATIO,
              },
            ]}
          >
            <Text style={styles.cardText}>{cards[0].title}</Text>
          </Animated.View>
        </PanGestureHandler>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}>
        <Text style={[styles.instructions, { color: theme.colors.text }]}>
          ← Swipe cards left or right →
        </Text>
      </View>
    </View>
  );
};

// [AI-FREEZE] Core styling maintaining consistent card appearance and animation
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
