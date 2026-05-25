import React from 'react';
import { View, Text, StyleSheet, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const StatCard = ({ title, value, icon, color, trend }) => {
  const isRTL = I18nManager.isRTL;
  const isPositive = trend && trend.startsWith('+');

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={[styles.value, isRTL && styles.valueRTL]}>{value}</Text>
        <Text style={[styles.title, isRTL && styles.titleRTL]}>{title}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons
              name={isPositive ? "trending-up" : "trending-down"}
              size={16}
              color={isPositive ? Colors.success : Colors.error}
            />
            <Text
              style={[
                styles.trend,
                { color: isPositive ? Colors.success : Colors.error },
              ]}
            >
              {trend}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
    padding: 10,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  valueRTL: {
    fontFamily: 'Arial',
  },
  title: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  titleRTL: {
    fontFamily: 'Arial',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  trend: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default StatCard;