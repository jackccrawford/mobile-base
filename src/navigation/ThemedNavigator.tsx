import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useTheme } from '../contexts/ThemeContext';
import { Home, Settings, Menu, ChevronLeft } from 'lucide-react-native';
import { Platform, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// [AI-MUTABLE] Pattern options may change as new patterns are added
const patterns = [
  { label: 'Infinite Scroll', value: 'infinitescroll' },
  { label: 'Masonry Grid', value: 'masonry' },
  { label: 'Card Swipe', value: 'cardswipe' },
  { label: 'More Cowbell', value: 'cowbell' },
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
        Pattern Bridge
      </Text>
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
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
          borderTopColor: 'rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
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
          headerRight: () => (
            <View style={{ 
              flexDirection: 'row',
              marginRight: 16,
              gap: 8,
            }}>
              <TouchableOpacity
                style={{ padding: 8 }}
                onPress={() => {
                  console.log('Right action');
                }}
              >
                <Settings size={24} color={theme.colors.onSurface} />
              </TouchableOpacity>
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: renderTitle,
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
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
          width: 200,
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
