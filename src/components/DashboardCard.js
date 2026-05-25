import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const DashboardCard = ({ title, subtitle, icon, color, onPress }) => {
  const isRTL = I18nManager.isRTL;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[color || Colors.primary, `${color || Colors.primary}CC`]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, isRTL && styles.titleRTL]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.subtitle, isRTL && styles.subtitleRTL]}>
                {subtitle}
              </Text>
            )}
          </View>
          {icon && (
            <MaterialIcons
              name={icon}
              size={40}
              color={Colors.textLight}
              style={styles.icon}
            />
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginBottom: 4,
  },
  titleRTL: {
    fontFamily: 'Arial',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.8,
  },
  subtitleRTL: {
    fontFamily: 'Arial',
  },
  icon: {
    opacity: 0.8,
  },
});

export default DashboardCard;