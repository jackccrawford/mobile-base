import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const SettingsScreen = () => {
  const { theme, toggleHeader } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Profile</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Name</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>Mobile Base User</Text>
          
          <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Theme</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{theme.dark ? 'Dark' : 'Light'}</Text>
          
          <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Header Style</Text>
          <TouchableOpacity 
            onPress={toggleHeader}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>
              {theme.useBuiltInHeader ? 'Using Built-in Header' : 'Using Custom Header'}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Version</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>1.0.0</Text>
        </View>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    opacity: 0.7,
  },
  value: {
    fontSize: 16,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
