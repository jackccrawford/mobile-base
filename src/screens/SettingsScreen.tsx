import React, { useState } from 'react';
import { StyleSheet, View, Text as RNText, TouchableOpacity, ScrollView, Linking, Platform, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Layout, ChevronRight, Info, Github, ExternalLink, Smartphone, Text as TextIcon, Monitor } from 'lucide-react-native';
import type { ThemeMode } from '../contexts/ThemeContext';

export const SettingsScreen = () => {
  const { theme, setHeaderTitle, setThemeMode } = useTheme();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(theme.headerTitle);

  const openGitHub = async () => {
    const url = 'https://github.com/jackccrawford/mobile-base';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const openMITLicense = async () => {
    const url = 'https://opensource.org/licenses/MIT';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const handleTitlePress = () => {
    setTempTitle(theme.headerTitle);
    setIsEditingTitle(true);
  };

  const handleTitleSubmit = () => {
    setHeaderTitle(tempTitle);
    setIsEditingTitle(false);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const getThemeIcon = () => {
    if (theme.themeMode === 'system') return <Smartphone size={24} color={theme.colors.onSurface} />;
    return theme.dark ?
      <Moon size={24} color={theme.colors.onSurface} /> :
      <Sun size={24} color={theme.colors.onSurface} />;
  };

  const getThemeText = () => {
    switch (theme.themeMode) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      default: return 'System';
    }
  };

  const remainingChars = 20 - (tempTitle?.length || 0);
  const charsColor = remainingChars <= 3 ? theme.colors.error :
    remainingChars <= 5 ? theme.colors.info :
      theme.colors.onSurfaceVariant;

  const renderSettingsItem = (
    icon: React.ReactNode,
    title: string,
    value?: string,
    onPress?: () => void,
    showChevron: boolean = true,
    rightIcon?: React.ReactNode,
    customContent?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[styles.settingsItem, { borderBottomColor: theme.colors.outline + '20' }]}
      onPress={onPress}
      disabled={!onPress && !customContent}
    >
      <View style={styles.settingsItemLeft}>
        {icon}
        <RNText style={[styles.settingsItemTitle, { color: theme.colors.onSurface }]}>{title}</RNText>
      </View>
      <View style={styles.settingsItemRight}>
        {customContent || (
          <>
            {value && (
              <RNText style={[styles.settingsItemValue, { color: theme.colors.onSurfaceVariant }]}>{value}</RNText>
            )}
            {rightIcon || (showChevron && <ChevronRight size={20} color={theme.colors.onSurfaceVariant} />)}
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const ThemeToggle = () => {
    const ThemeIcon = {
      'light': Sun,
      'dark': Moon,
      'system': Monitor
    }[theme.themeMode];

    const nextMode = {
      'light': 'dark',
      'dark': 'system',
      'system': 'light'
    }[theme.themeMode];

    return (
      <TouchableOpacity
        style={styles.settingsItem}
        onPress={() => setThemeMode(nextMode)}
      >
        <View style={styles.settingsItemLeft}>
          <Layout size={24} color={theme.colors.onSurface} />
          <RNText style={[styles.settingsItemTitle, { color: theme.colors.onSurface }]}>
            Theme
          </RNText>
        </View>
        <ThemeIcon size={24} color={theme.colors.onSurface} />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.section}>
        <RNText style={[styles.sectionTitle, { color: theme.colors.primary }]}>Appearance</RNText>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, elevation: 2 }]}>
          <ThemeToggle />
          {renderSettingsItem(
            <TextIcon size={24} color={theme.colors.onSurface} />,
            'Header Title',
            theme.headerTitle,
            handleTitlePress,
            false,
            undefined,
            isEditingTitle && (
              <View style={styles.titleEditContainer}>
                <TextInput
                  value={tempTitle}
                  onChangeText={setTempTitle}
                  style={[styles.titleInput, {
                    color: theme.colors.onSurface,
                    borderColor: theme.colors.outline,
                  }]}
                  maxLength={20}
                  autoFocus
                  onBlur={handleTitleSubmit}
                  onSubmitEditing={handleTitleSubmit}
                />
                <RNText style={[styles.charCount, { color: charsColor }]}>
                  {remainingChars}
                </RNText>
              </View>
            )
          )}
        </View>
      </View>

      <View style={styles.section}>
        <RNText style={[styles.sectionTitle, { color: theme.colors.primary }]}>About</RNText>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, elevation: 2 }]}>
          {renderSettingsItem(
            <Info size={24} color={theme.colors.onSurface} />,
            'Version',
            '1.0.0',
            undefined,
            false
          )}
          {renderSettingsItem(
            <Github size={24} color={theme.colors.onSurface} />,
            'Source Code',
            'View on GitHub',
            openGitHub,
            false,
            <ExternalLink size={20} color={theme.colors.onSurfaceVariant} />
          )}
          {renderSettingsItem(
            <Monitor size={24} color={theme.colors.onSurface} />,
            'MIT License',
            'View MIT License',
            openMITLicense,
            false,
            <ExternalLink size={20} color={theme.colors.onSurfaceVariant} />
          )}
        </View>
      </View>

      <RNText style={[styles.footer, { color: theme.colors.onSurfaceVariant }]}>Coders gotta code!{'\n'}{'\n'}
        Managed Ventures LLC{'\n'}
        Scottsdale | Arizona | USA{'\n'}Copyright © 2025
      </RNText>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 8,
    letterSpacing: 0.1,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
    }),
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  settingsItemValue: {
    fontSize: 14,
    fontWeight: '400',
  },
  titleEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleInput: {
    fontSize: 14,
    fontWeight: '400',
    padding: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 4,
    width: 120,
  },
  charCount: {
    fontSize: 12,
    fontWeight: '500',
    width: 24,
    textAlign: 'right',
  },
  footer: {
    textAlign: 'center',
    padding: 16,
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  themeButton: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  themeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
