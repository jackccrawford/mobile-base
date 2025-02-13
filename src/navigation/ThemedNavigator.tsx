import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useTheme } from '../contexts/ThemeContext';
import { Home, Settings, Menu, ChevronLeft, Bell, BellDot, Sun, Moon, Monitor } from 'lucide-react-native';
import { Platform, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// [AI-MUTABLE] Pattern options may change as new patterns are added
const patterns = [
  { label: 'Masonry Grid', value: 'masonry' },
  { label: 'Infinite Scroll', value: 'infinitescroll' },
  { label: 'Card Swipe', value: 'cardswipe' },
  { label: 'Cowbell', value: 'cowbell' },
];

const CustomDrawerContent = (props) => {
  const { theme } = useTheme();

  // Get current screen and pattern state
  const state = props.state;
  const currentTab = state?.routes[state.index]?.name || '';
  const isHomeScreen = currentTab === 'Main' && state?.routes[state.index]?.state?.routes[0]?.name === 'Home';
  const currentPattern = isHomeScreen ? (state?.routes[state.index]?.state?.routes[0]?.params?.pattern || 'masonry') : null;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
      }}
    >
      {patterns.map((pattern) => {
        const isSelected = isHomeScreen && pattern.value === currentPattern;
        return (
          <DrawerItem
            key={pattern.value}
            label={pattern.label}
            onPress={() => {
              props.navigation.navigate('Main', {
                screen: 'Home',
                params: { pattern: pattern.value }
              });
              props.navigation.closeDrawer();
            }}
            pressColor={`${theme.colors.primary}20`}
            pressOpacity={0.9}
            labelStyle={[
              styles.drawerItemText,
              {
                color: theme.colors.onSurface,
                opacity: isSelected ? 0.38 : 1
              }
            ]}
            style={[
              styles.drawerItem,
              isSelected && {
                backgroundColor: `${theme.colors.primary}10`
              }
            ]}
          />
        );
      })}
    </DrawerContentScrollView>
  );
};

const HeaderBell = () => {
  const { theme } = useTheme();
  const [isActive, setIsActive] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setIsActive(!isActive)}
      style={{ marginRight: 16 }}
    >
      {isActive ? (
        <BellDot size={24} color={theme.colors.primary} />
      ) : (
        <Bell size={24} color={theme.colors.onSurface} />
      )}
    </TouchableOpacity>
  );
};

const TabNavigator = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const renderTitle = () => (
    <View style={{ alignItems: 'center' }}>
      <Text style={{
        color: theme.colors.onSurface,
        fontSize: 18,
        fontWeight: '500'
      }}>
        {theme.headerTitle}
      </Text>
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: '400',
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.outline + '20',
          backgroundColor: theme.colors.surface,
          paddingTop: 8,
          height: Platform.select({
            ios: 60 + insets.bottom,
            android: 60,
            web: 68,
          }),
          paddingBottom: Platform.select({
            ios: insets.bottom,
            android: 8,
            web: 8,
          }),
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 8, padding: 8 }}
              onPress={() => {
                navigation.dispatch(DrawerActions.toggleDrawer());
              }}
            >
              <Menu size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          ),
          headerTitle: renderTitle,
          headerRight: () => <HeaderBell />,
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export const ThemedNavigator = () => {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.colors.surface,
          width: Platform.select({
            web: 280,
            default: '80%',
          }),
          maxWidth: 350,
          minWidth: 250,
        },
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Drawer.Screen
        name="Main"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

// [AI-FREEZE] Core styling following MD3 specifications
const styles = StyleSheet.create({
  drawerItem: {
    marginHorizontal: 12,
    marginVertical: 0,
    borderRadius: 28,
  },
  drawerItemText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
});
