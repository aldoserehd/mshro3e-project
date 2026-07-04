import React, { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../locales/i18n';
import Text from '../ui/Text';
import Button from '../ui/Button';
import Screen from '../ui/Screen';
import { palette, radius, semantic, spacing } from '../theme/ts';
import { RootStackScreenProps } from '../navigation/types';
import { ONBOARDED_KEY } from './SplashScreen';

interface Slide {
  key: string;
  title: string;
  body: string;
  animation: any;
}

const animations = {
  welcome: require('../assets/animations/welcome.json'),
  tracking: require('../assets/animations/project-tracking.json'),
  success: require('../assets/animations/success.json'),
};

const slides: Slide[] = [
  { key: 'a', title: 'onboarding.slide1Title', body: 'onboarding.slide1Body', animation: animations.welcome },
  { key: 'b', title: 'onboarding.slide2Title', body: 'onboarding.slide2Body', animation: animations.tracking },
  { key: 'c', title: 'onboarding.slide3Title', body: 'onboarding.slide3Body', animation: animations.success },
];

export default function OnboardingScreen({ navigation }: RootStackScreenProps<'Onboarding'>) {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  const finish = () => {
    AsyncStorage.setItem(ONBOARDED_KEY, '1').catch(() => {});
    navigation.replace('MainTabs');
  };

  const goNext = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToOffset({ offset: (index + 1) * width, animated: true });
    } else {
      finish();
    }
  };

  const skip = finish;

  return (
    <Screen background={palette.navy900}>
      <View style={styles.topBar}>
        <Button title={i18n.t('onboarding.skip')} variant="ghost" size="sm" onPress={skip} />
      </View>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.lottieWrap}>
              <LottieView
                source={item.animation}
                autoPlay
                loop
                style={styles.lottie}
                resizeMode="contain"
              />
            </View>
            <Text variant="pageTitle" weight="700" color={palette.white} align="center" style={styles.title}>
              {i18n.t(item.title)}
            </Text>
            <Text
              variant="body"
              color={palette.navy300}
              align="center"
              style={styles.body}
            >
              {i18n.t(item.body)}
            </Text>
          </View>
        )}
      />
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === index ? palette.white : palette.navy600, width: i === index ? 24 : 8 },
            ]}
          />
        ))}
      </View>
      <View style={styles.footer}>
        <Button
          title={index === slides.length - 1 ? i18n.t('onboarding.start') : i18n.t('onboarding.next')}
          variant="primary"
          size="lg"
          fullWidth
          onPress={goNext}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 44,
    paddingHorizontal: spacing.s4,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  slide: {
    paddingHorizontal: spacing.s5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieWrap: {
    width: '100%',
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: { width: '100%', height: '100%' },
  title: { marginTop: spacing.s5 },
  body: { marginTop: spacing.s3, maxWidth: 320 },
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: spacing.s5,
  },
  dot: {
    height: 8,
    marginHorizontal: 4,
    borderRadius: radius.full,
  },
  footer: {
    paddingHorizontal: spacing.s5,
    paddingBottom: spacing.s5,
  },
});
