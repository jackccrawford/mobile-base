import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { CardSwipeWrapper } from '../components/patterns/CardSwipe/CardSwipeWrapper';
import { MasonryGridDemo } from '../components/patterns/MasonryGrid/MasonryGridDemo';
import { InfiniteScrollDemo } from '../components/patterns/InfiniteScroll/InfiniteScrollDemo';
import { CowbellDemo } from '../components/patterns/MoreCowbell/CowbellDemo';
import { useRoute } from '@react-navigation/native';

type Pattern = 'masonry' | 'cowbell' | 'cardswipe' | 'infinitescroll';

export const HomeScreen = () => {
  const { theme } = useTheme();
  const route = useRoute();
  const [selectedPattern, setSelectedPattern] = useState<Pattern>('masonry');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
  
    const pattern = (route.params as any)?.pattern;
    if (pattern && pattern !== selectedPattern) {
      handlePatternChange(pattern as Pattern);
    }
  }, [route.params]);

  const handlePatternChange = useCallback((newPattern: Pattern) => {
    if (isTransitioning) return; // Prevent multiple rapid switches
    setIsTransitioning(true);
    
    // Allow time for cleanup
    setTimeout(() => {
      setSelectedPattern(newPattern);
      setIsTransitioning(false);
    }, 100); // Short delay for cleanup
  }, [isTransitioning]);

  const renderPattern = useCallback(() => {
    if (isTransitioning) {
      return null; // Show nothing during transition
    }

    switch (selectedPattern) {
      case 'masonry':
        return <MasonryGridDemo />;
      case 'cowbell':
        return <CowbellDemo />;
      case 'cardswipe':
        return <CardSwipeWrapper />;
      case 'infinitescroll':
        return <InfiniteScrollDemo />;
      default:
        return <MasonryGridDemo />;
    }
  }, [selectedPattern, isTransitioning]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {renderPattern()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
