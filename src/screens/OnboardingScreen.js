import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, I18nManager } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import Colors from '../constants/Colors';
import i18n from '../locales/i18n';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const isRTL = I18nManager.isRTL;

  const pages = [
    {
      backgroundColor: Colors.primary,
      image: (
        <View style={styles.lottieContainer}>
          <LottieView
            source={require('../assets/animations/welcome.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      ),
      title: i18n.t('onboarding.title1'),
      subtitle: i18n.t('onboarding.subtitle1'),
    },
    {
      backgroundColor: Colors.secondary,
      image: (
        <View style={styles.lottieContainer}>
          <LottieView
            source={require('../assets/animations/project-tracking.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      ),
      title: i18n.t('onboarding.title2'),
      subtitle: i18n.t('onboarding.subtitle2'),
    },
    {
      backgroundColor: Colors.accent,
      image: (
        <View style={styles.lottieContainer}>
          <LottieView
            source={require('../assets/animations/success.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      ),
      title: i18n.t('onboarding.title3'),
      subtitle: i18n.t('onboarding.subtitle3'),
    },
  ];

  const handleDone = () => {
    navigation.replace('MainApp');
  };

  return (
    <Onboarding
      pages={pages}
      onDone={handleDone}
      onSkip={handleDone}
      skipLabel={i18n.t('onboarding.skip')}
      nextLabel={i18n.t('onboarding.next')}
      doneLabel={i18n.t('onboarding.done')}
      titleStyles={[styles.title, isRTL && styles.titleRTL]}
      subTitleStyles={[styles.subtitle, isRTL && styles.subtitleRTL]}
      containerStyles={styles.container}
      imageContainerStyles={styles.imageContainer}
      bottomBarHighlight={false}
      showSkip={true}
      showNext={true}
      showDone={true}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    paddingBottom: 40,
  },
  lottieContainer: {
    width: width * 0.8,
    height: height * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  titleRTL: {
    fontFamily: 'Arial',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 30,
    opacity: 0.8,
  },
  subtitleRTL: {
    fontFamily: 'Arial',
  },
});

export default OnboardingScreen;