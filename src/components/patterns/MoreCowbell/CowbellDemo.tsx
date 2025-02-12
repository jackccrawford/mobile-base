// [AI-FREEZE] Core cowbell interaction pattern
import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, View, ActivityIndicator, Platform } from 'react-native';
import { Text } from '../../Text';
import { useTheme } from '../../../contexts/ThemeContext';
import { Audio } from 'expo-av';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  Easing,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Bell, Pause, Play } from 'lucide-react-native';

// [AI-FREEZE] Core audio configuration
const COWBELL_SOUND = require('./assets/cowbell.mp3');

// [AI-MUTABLE] Interactive state management
export const CowbellDemo = () => {
  const { theme } = useTheme();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const fever = useSharedValue(0);
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Initialize audio session for better sound quality
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (err) {
        console.error('Failed to initialize audio:', err);
        setError('Failed to initialize audio system');
      }
    };
    initAudio();
  }, []);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        // Stop playing first
        sound.stopAsync().then(() => {
          sound.unloadAsync();
        }).catch(error => {
          console.error('Error cleaning up sound:', error);
        });
      }
    };
  }, [sound]);

  const playSound = async () => {
    try {
      setIsLoading(true);
      setError(undefined);

      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          COWBELL_SOUND,
          { 
            volume: 1.0,
            isLooping: true,
            shouldPlay: Platform.OS === 'ios' // Only auto-play on iOS
          }
        );
        setSound(newSound);
        if (Platform.OS === 'android') {
          await newSound.playAsync(); // Explicitly play on Android
        }
        setIsPlaying(true);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      setError('Failed to play sound');
    } finally {
      setIsLoading(false);
    }
  };

  const stopSound = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
      setError('Failed to stop sound');
    }
  };

  const toggleSound = async () => {
    if (isPlaying) {
      await stopSound();
    } else {
      await playSound();
    }
    animateBell();
  };

  const animateBell = () => {
    const INTENSITY = 1.5; // Animation intensity multiplier
    
    rotation.value = withSequence(
      withTiming(-15 * INTENSITY, { duration: 50 }),
      withSpring(15 * INTENSITY, { 
        damping: 2,  // Less damping = more sustain
        stiffness: 80 // Rock on
      }),
      withSpring(-10 * INTENSITY),
      withSpring(0)
    );

    scale.value = withSequence(
      withSpring(1.2 * INTENSITY, {
        mass: 2 // Heavy metal
      }),
      withSpring(1)
    );

    fever.value = withSequence(
      withTiming(1, { 
        duration: 200,
        easing: Easing.inOut(Easing.ease)
      }),
      withDelay(500, withTiming(0, { duration: 300 }))
    );
  };

  const bellStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ]
  }));

  const feverStyle = useAnimatedStyle(() => ({
    opacity: fever.value,
    transform: [
      { translateY: interpolate(fever.value, [0, 1], [10, -20]) }
    ]
  }));

  return (
    <View style={styles.container}>
      <View style={styles.feverContainer}>
        <Text style={[styles.feverText, { color: theme.colors.primary }]}>
          {isPlaying ? '🎸 Rock on! 🎸' : '🔔 Ring that bell! 🔔'}
        </Text>
      </View>
      
      <Pressable 
        onPress={toggleSound}
        disabled={isLoading}
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.7 },
          { 
            backgroundColor: isPlaying 
              ? theme.colors.primary + '30'
              : theme.colors.secondary + '20'
          }
        ]}
      >
        <Animated.View style={[styles.bellContainer, bellStyle]}>
          {isLoading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <>
              <Bell 
                size={32} 
                color={isPlaying ? theme.colors.primary : theme.colors.secondary}
                strokeWidth={2.5}
              />
              {isPlaying ? (
                <View style={[styles.iconBackground, { backgroundColor: theme.colors.primary }]}>
                  <Pause size={16} color="white" style={styles.playIcon} />
                </View>
              ) : (
                <View style={[styles.iconBackground, { backgroundColor: theme.colors.secondary }]}>
                  <Play size={16} color="white" style={styles.playIcon} />
                </View>
              )}
            </>
          )}
        </Animated.View>
      </Pressable>

      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

// [AI-FREEZE] Core styling for cowbell interaction
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 20,
    borderRadius: 50,
  },
  bellContainer: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 8,
    padding: 3,
  },
  playIcon: {
    margin: -1,
  },
  feverContainer: {
    position: 'absolute',
    top: '40%',
    alignItems: 'center',
  },
  feverText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorText: {
    marginTop: 16,
    fontSize: 14,
  },
});
