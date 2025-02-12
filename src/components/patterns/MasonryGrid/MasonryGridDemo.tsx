import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Image } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Text } from '../../../components/Text';
import { useTheme } from '../../../contexts/ThemeContext';

// [AI-FREEZE] Grid configuration and core types
const COLUMN_COUNT = 2;
const GRID_PADDING = 16;
const ITEM_MARGIN = 8;
const ITEMS_PER_PAGE = 10;

interface GridItem {
  id: number;
  height: number;
  title: string;
  type: 'image' | 'color';
  colors?: string[];
  imageUrl?: string;
  overlayColor?: string;
}

// [AI-FREEZE] Color blend configurations
const COLOR_BLEND_CONFIGS: Array<{ colors: string[] }> = [
  {
    colors: ['#FF6B6B', '#4ECDC4'],
  },
  {
    colors: ['#45B7D1', '#FFEEAD'],
  },
  {
    colors: ['#96CEB4', '#FF6B6B'],
  },
  {
    colors: ['#845EC2', '#FF9671'],
  },
  {
    colors: ['#FFC75F', '#F9F871'],
  },
];

const generateItems = (start: number, count: number): GridItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const isImage = i % 2 === 0; // Alternate between image and color items
    
    if (isImage) {
      return {
        id: start + i,
        height: Math.random() * 100 + 200, // Slightly taller for images
        title: `${start + i + 1} Image`,
        type: 'image',
        imageUrl: `https://picsum.photos/500/300?random=${start + i}`,
        overlayColor: '#FF6B6B',
      };
    } else {
      const blend = COLOR_BLEND_CONFIGS[i % COLOR_BLEND_CONFIGS.length];
      return {
        id: start + i,
        height: Math.random() * 100 + 100,
        title: `${start + i + 1} Color`,
        type: 'color',
        colors: blend.colors,
      };
    }
  });
};

export const MasonryGridDemo = () => {
  const { theme } = useTheme();
  const [items, setItems] = useState<GridItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate fetching data
  const fetchItems = useCallback(async (refresh = false) => {
    const start = refresh ? 0 : items.length;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItems = generateItems(start, ITEMS_PER_PAGE);
    
    if (refresh) {
      setItems(newItems);
    } else {
      setItems(prevItems => [...prevItems, ...newItems]);
    }
  }, [items.length]);

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

  // Organize items into columns
  const columns = React.useMemo(() => {
    const cols: GridItem[][] = Array.from({ length: COLUMN_COUNT }, () => []);
    let colHeights = Array(COLUMN_COUNT).fill(0);

    items.forEach(item => {
      // Find shortest column
      const shortestCol = colHeights.indexOf(Math.min(...colHeights));
      cols[shortestCol].push(item);
      colHeights[shortestCol] += item.height;
    });

    return cols;
  }, [items]);

  // Detect when we're near the end
  const handleScroll = useCallback((event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom) {
      onEndReached();
    }
  }, [onEndReached]);

  const renderColorItem = (item: GridItem) => (
    <View style={[styles.blendContainer, { height: item.height }]}>
      {/* Base color layer */}
      <View style={[styles.colorLayer, { backgroundColor: item.colors![0] }]} />
      {/* Diagonal overlay layers */}
      <View style={[styles.diagonalLayer1, { backgroundColor: item.colors![1], opacity: 0.7 }]} />
      <View style={[styles.diagonalLayer2, { backgroundColor: item.colors![1], opacity: 0.5 }]} />
      <View style={[styles.diagonalLayer3, { backgroundColor: item.colors![1], opacity: 0.3 }]} />
      <Text style={styles.itemTitle}>{item.title}</Text>
    </View>
  );

  const renderImageItem = (item: GridItem) => (
    <View style={[styles.blendContainer, { height: item.height, isolation: 'isolate' }]}>
      {/* Base image */}
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      {/* Overlay */}
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: item.overlayColor,
          },
        ]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {columns.map((column, columnIndex) => (
            <View key={columnIndex} style={styles.column}>
              {column.map((item, index) => (
                <Animated.View
                  key={item.id}
                  entering={FadeIn.delay(index * 100)}
                  style={[
                    styles.item,
                    {
                      height: item.height,
                      marginBottom: ITEM_MARGIN,
                      backgroundColor: theme.colors.surface,
                    },
                  ]}
                >
                  {item.type === 'color' ? renderColorItem(item) : renderImageItem(item)}
                </Animated.View>
              ))}
            </View>
          ))}
        </View>
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
  grid: {
    flexDirection: 'row',
    padding: GRID_PADDING,
    gap: ITEM_MARGIN,
  },
  column: {
    flex: 1,
  },
  item: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  blendContainer: {
    position: 'absolute',
    width: '100%',
    overflow: 'hidden',
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
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  itemTitle: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
});
