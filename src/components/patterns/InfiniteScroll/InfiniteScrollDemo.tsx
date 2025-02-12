import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ScrollItem {
  id: number;
  type: 'color' | 'image';
  colors?: string[];
  imageUrl?: string;
}

interface Item {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  blendMode: 'luminosity' | 'hue' | 'saturation' | 'soft-light';
  overlayColor: string;
}

// [AI-FREEZE] Blend mode configurations
const BLEND_CONFIGS = [
  { mode: 'luminosity' as const, color: '#FF6B6B' },
  { mode: 'hue' as const, color: '#4ECDC4' },
  { mode: 'saturation' as const, color: '#45B7D1' },
  { mode: 'soft-light' as const, color: '#96CEB4' },
];

// [AI-FREEZE] Color blend configurations and core types
const COLOR_PAIRS = [
  ['#FF6B6B', '#4ECDC4'],
  ['#45B7D1', '#FFEEAD'],
  ['#96CEB4', '#FF6B6B'],
  ['#845EC2', '#FF9671'],
  ['#FFC75F', '#F9F871'],
];

// [AI-MUTABLE] Item generation and rendering
const generateItems = (start: number, count: number): ScrollItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const isColorItem = i % 2 === 0;
    const colors = COLOR_PAIRS[i % COLOR_PAIRS.length];
    
    if (isColorItem) {
      return {
        id: start + i,
        type: 'color',
        colors: colors,
      };
    } else {
      return {
        id: start + i,
        type: 'image',
        imageUrl: `https://picsum.photos/800/400?random=${start + i}`,
      };
    }
  });
};

const renderItem = ({ item }: { item: ScrollItem }) => {
  if (item.type === 'color') {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.colorContainer}>
          {/* Base color layer */}
          <View style={[styles.colorLayer, { backgroundColor: item.colors?.[0] ?? '#ffffff' }]} />
          {/* Diagonal overlay layers */}
          <View style={[styles.diagonalLayer1, { backgroundColor: item.colors?.[1] ?? '#ffffff', opacity: 0.7 }]} />
          <View style={[styles.diagonalLayer2, { backgroundColor: item.colors?.[1] ?? '#ffffff', opacity: 0.5 }]} />
          <View style={[styles.diagonalLayer3, { backgroundColor: item.colors?.[1] ?? '#ffffff', opacity: 0.3 }]} />
        </View>
        <Text style={styles.itemText}>{`${item.id + 1} Color Blend`}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.itemText}>{`${item.id + 1} Image`}</Text>
      </View>
    );
  }
};

export const InfiniteScrollDemo = () => {
  const { theme } = useTheme();
  const [items, setItems] = useState<ScrollItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate fetching data with images
  const fetchItems = useCallback(async (refresh = false) => {
    const start = refresh ? 0 : items.length;
    const newItems = generateItems(start, 10);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (refresh) {
      setItems(newItems);
    } else {
      setItems(prevItems => [...prevItems, ...newItems]);
    }
  }, [items]);

  // Handle pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchItems(true);
    setRefreshing(false);
  }, [fetchItems]);

  // Handle reaching end of list
  const onEndReached = useCallback(async () => {
    if (!loading) {
      setLoading(true);
      await fetchItems();
      setLoading(false);
    }
  }, [loading, fetchItems]);

  // Initial load
  useEffect(() => {
    fetchItems();
  }, []);

  // Detect when we're near the end
  const handleScroll = useCallback((event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom) {
      onEndReached();
    }
  }, [onEndReached]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {items.map(item => (
          <Animated.View 
            key={item.id}
            entering={FadeIn.delay(item.id * 100)}
          >
            {renderItem({ item })}
          </Animated.View>
        ))}
        {loading && (
          <ActivityIndicator style={styles.loader} size="large" />
        )}
      </ScrollView>
    </View>
  );
};

// [AI-FREEZE] Core styling for blend effects
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  colorContainer: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  colorLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  diagonalLayer1: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    top: '-25%',
    left: '-25%',
    transform: [{ rotate: '45deg' }],
  },
  diagonalLayer2: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    top: '-25%',
    left: '-25%',
    transform: [{ rotate: '30deg' }],
  },
  diagonalLayer3: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    top: '-25%',
    left: '-25%',
    transform: [{ rotate: '15deg' }],
  },
  image: {
    width: '100%',
    height: 400,
  },
  itemText: {
    padding: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
});
