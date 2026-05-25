import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import i18n from '../locales/i18n';

const ProjectCard = ({ project, onPress }) => {
  const isRTL = I18nManager.isRTL;
  const progressPercentage = Math.round(project.progress * 100);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return Colors.primary;
      case 'completed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.surface, Colors.surface]}
          style={styles.card}
        >
          <View style={styles.header}>
            <Text style={[styles.title, isRTL && styles.titleRTL]} numberOfLines={1}>
              {project.title}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor(project.status)}20` },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(project.status) },
                ]}
              >
                {i18n.t(`projects.${project.status}`)}
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, isRTL && styles.progressLabelRTL]}>
                {i18n.t('projects.progress')}
              </Text>
              <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor: getStatusColor(project.status),
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.deadlineContainer}>
              <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
              <Text style={[styles.deadline, isRTL && styles.deadlineRTL]}>
                {project.deadline}
              </Text>
            </View>

            <View style={styles.teamContainer}>
              {project.team.slice(0, 3).map((member, index) => (
                <View key={index} style={[styles.avatar, { marginLeft: index > 0 ? -10 : 0 }]}>
                  <Text style={styles.avatarText}>{member[0]}</Text>
                </View>
              ))}
              {project.team.length > 3 && (
                <View style={[styles.avatar, { marginLeft: -10 }]}>
                  <Text style={styles.avatarText}>+{project.team.length - 3}</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  card: {
    width: 280,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 10,
  },
  titleRTL: {
    fontFamily: 'Arial',
    marginRight: 0,
    marginLeft: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  progressLabelRTL: {
    fontFamily: 'Arial',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadline: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  deadlineRTL: {
    marginLeft: 0,
    marginRight: 6,
    fontFamily: 'Arial',
  },
  teamContainer: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
  },
});

export default ProjectCard;