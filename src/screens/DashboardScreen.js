import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import i18n from '../locales/i18n';
import DashboardCard from '../components/DashboardCard';
import ProjectCard from '../components/ProjectCard';
import StatCard from '../components/StatCard';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const isRTL = I18nManager.isRTL;

  const stats = [
    {
      title: i18n.t('dashboard.projects'),
      value: '12',
      icon: 'briefcase-outline',
      color: Colors.primary,
      trend: '+3',
    },
    {
      title: i18n.t('dashboard.tasks'),
      value: '48',
      icon: 'list-outline',
      color: Colors.secondary,
      trend: '+8',
    },
    {
      title: i18n.t('dashboard.inProgress'),
      value: '7',
      icon: 'time-outline',
      color: Colors.warning,
      trend: '0',
    },
    {
      title: i18n.t('dashboard.completed'),
      value: '5',
      icon: 'checkmark-circle-outline',
      color: Colors.success,
      trend: '+2',
    },
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'تطبيق الجوال',
      progress: 0.75,
      deadline: '2024-02-15',
      team: ['أحمد', 'فاطمة', 'محمد'],
      status: 'active',
    },
    {
      id: 2,
      title: 'موقع الويب',
      progress: 0.45,
      deadline: '2024-03-01',
      team: ['سارة', 'علي'],
      status: 'active',
    },
    {
      id: 3,
      title: 'نظام إدارة المحتوى',
      progress: 0.90,
      deadline: '2024-01-30',
      team: ['نور', 'خالد', 'ليلى'],
      status: 'active',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, isRTL && styles.headerTitleRTL]}>
            {i18n.t('dashboard.title')}
          </Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
              {i18n.t('dashboard.projects')}
            </Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, isRTL && styles.viewAllTextRTL]}>
                {i18n.t('dashboard.viewAll')}
              </Text>
              <MaterialIcons 
                name={isRTL ? "chevron-left" : "chevron-right"} 
                size={20} 
                color={Colors.primary} 
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.projectsScrollContainer}
          >
            {recentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPress={() => navigation.navigate('ProjectDetails', { project })}
              />
            ))}
          </ScrollView>
        </View>

        {/* Add Project Button */}
        <TouchableOpacity style={styles.addButton}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="add" size={24} color={Colors.textLight} />
            <Text style={[styles.addButtonText, isRTL && styles.addButtonTextRTL]}>
              {i18n.t('dashboard.newProject')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  headerTitleRTL: {
    fontFamily: 'Arial',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginTop: -50,
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionTitleRTL: {
    fontFamily: 'Arial',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 5,
  },
  viewAllTextRTL: {
    marginRight: 0,
    marginLeft: 5,
    fontFamily: 'Arial',
  },
  projectsScrollContainer: {
    paddingRight: 20,
  },
  addButton: {
    margin: 20,
    marginTop: 30,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
    marginLeft: 10,
  },
  addButtonTextRTL: {
    marginLeft: 0,
    marginRight: 10,
    fontFamily: 'Arial',
  },
});

export default DashboardScreen;