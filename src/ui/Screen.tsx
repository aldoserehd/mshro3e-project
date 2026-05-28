import React from 'react';
import { StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { semantic } from '../theme/ts';

export interface ScreenProps {
  children?: React.ReactNode;
  background?: string;
  /** Default ['top','left','right']. Pass 'all' for everything including bottom. */
  edges?: Edge[] | 'all';
  /** Status bar mode. */
  statusBar?: 'dark' | 'light';
  style?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  background = semantic.bg,
  edges = ['top', 'left', 'right'],
  statusBar = 'dark',
  style,
}) => {
  const resolvedEdges = edges === 'all' ? ['top', 'left', 'right', 'bottom'] as Edge[] : edges;
  return (
    <SafeAreaView edges={resolvedEdges} style={[styles.flex, { backgroundColor: background }, style]}>
      <StatusBar
        barStyle={statusBar === 'dark' ? 'dark-content' : 'light-content'}
        backgroundColor={background}
      />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

export default Screen;
