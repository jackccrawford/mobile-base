import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import { useTheme } from '../../../contexts/ThemeContext';

interface Item {
  id: number;
  color: string;
  colorName: string;
  height: number;
}

// Just beautiful, vibrant colors - no need to overthink contrast
const COLORS = [
  { color: '#FF0000', name: 'Red' },
  { color: '#00FF00', name: 'Green' },
  { color: '#0000FF', name: 'Blue' },
  { color: '#FFFF00', name: 'Yellow' },
  { color: '#FF00FF', name: 'Magenta' },
  { color: '#00FFFF', name: 'Cyan' },
  { color: '#FF8000', name: 'Orange' },
  { color: '#8000FF', name: 'Purple' },
  { color: '#0080FF', name: 'Sky Blue' },
  { color: '#FF0080', name: 'Pink' },
  { color: '#80FF00', name: 'Lime' },
  { color: '#00FF80', name: 'Spring Green' },
  { color: '#FFFFFF', name: 'White' },
  { color: '#808080', name: 'Gray' },
  { color: '#000000', name: 'Black' },
];

export const MasonryGridDemo = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const numColumns = width > 680 ? 3 : 2;

  const data: Item[] = COLORS.map((colorInfo, index) => ({
    id: index + 1,
    color: colorInfo.color,
    colorName: colorInfo.name,
    height: Math.floor(Math.random() * 60) + 120,
  }));

  const renderItem = ({ item }: { item: Item }) => {
    const backgroundColor = theme.dark ? `${item.color}90` : item.color;
    
    return (
      <View
        style={[
          styles.itemContainer,
          { height: item.height, backgroundColor }
        ]}
        accessible={true}
        accessibilityLabel={`Color ${item.colorName}, item number ${item.id}`}
      >
        <View style={styles.textContainer}>
          <Text style={styles.itemId}>{item.id}</Text>
          <Text style={styles.itemText}>{item.colorName}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <MasonryList
        data={data}
        keyExtractor={(item: Item): string => item.id.toString()}
        numColumns={numColumns}
        renderItem={renderItem}
        contentContainerStyle={styles.masonry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  masonry: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  itemContainer: {
    margin: 6,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)', // Subtle dark overlay for text protection
  },
  itemId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  itemText: {
    fontSize: 16,
    color: '#FFFFFF',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
});
