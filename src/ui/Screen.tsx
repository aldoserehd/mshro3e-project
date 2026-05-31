import React from 'react';
import { StatusBar, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useEffectiveTheme, backgroundFor } from '../stores/theme';

export interface ScreenProps {
  children?: React.ReactNode;
  background?: string;
  /** Default ['top','left','right']. Pass 'all' for everything including bottom. */
  edges?: Edge[] | 'all';
  /** Status bar mode. Auto-flips based on theme if not provided. */
  statusBar?: 'dark' | 'light';
  style?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  background,
  edges = ['top', 'left', 'right'],
  statusBar,
  style,
}) => {
  const theme = useEffectiveTheme();
  const bg = background ?? backgroundFor(theme);
  const sb = statusBar ?? (theme === 'dark' ? 'light' : 'dark');
  const resolvedEdges = edges === 'all' ? ['top', 'left', 'right', 'bottom'] as Edge[] : edges;
  return (
    <SafeAreaView edges={resolvedEdges} style={[styles.flex, { backgroundColor: bg }, style]}>
      <StatusBar barStyle={sb === 'dark' ? 'dark-content' : 'light-content'} backgroundColor={bg} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

export default Screen;
