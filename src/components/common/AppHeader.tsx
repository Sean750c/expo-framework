import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/hooks/useTheme';
import { ArrowLeft, Bell } from 'lucide-react-native';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  showNotification?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;
  backgroundColor?: string;
  titleColor?: string;
  transparent?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightComponent,
  showNotification = false,
  notificationCount = 0,
  onNotificationPress,
  backgroundColor,
  titleColor,
  transparent = false,
}) => {
  const { theme } = useTheme();

  const headerBackgroundColor = backgroundColor || (transparent ? 'transparent' : theme.colors.background);
  const textColor = titleColor || theme.colors.text;

  return (
    <>
      <StatusBar 
        barStyle={theme.colors.background === '#000000' ? 'light-content' : 'dark-content'} 
        backgroundColor={headerBackgroundColor}
      />
      <SafeAreaView 
        style={[
          styles.container, 
          { backgroundColor: headerBackgroundColor }
        ]} 
        edges={['top']}
      >
        <View style={styles.header}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {showBackButton && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBackPress}
                activeOpacity={0.7}
              >
                <ArrowLeft size={24} color={textColor} />
              </TouchableOpacity>
            )}
          </View>

          {/* Center Section */}
          <View style={styles.centerSection}>
            {title && (
              <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            {showNotification && (
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={onNotificationPress}
                activeOpacity={0.7}
              >
                <Bell size={24} color={textColor} />
                {notificationCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                    <Text style={styles.badgeText}>
                      {notificationCount > 99 ? '99+' : notificationCount.toString()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            {rightComponent}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  notificationButton: {
    padding: 8,
    marginRight: -8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});