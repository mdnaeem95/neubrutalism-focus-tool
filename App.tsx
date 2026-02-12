import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabNavigator } from './src/navigation/TabNavigator';
import { AnimatedSplash } from './src/components/branding/AnimatedSplash';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { useStore } from './src/stores';
import { requestNotificationPermissions } from './src/hooks/useNotifications';
import { initializePurchases } from './src/utils/purchases';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [ready, setReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    let fontsDone = false;
    let storeHydrated = useStore.persist.hasHydrated();

    const trySetReady = () => {
      if (fontsDone && storeHydrated) {
        setReady(true);
        SplashScreen.hideAsync().catch(() => {});
      }
    };

    const unsub = useStore.persist.onFinishHydration(() => {
      storeHydrated = true;
      trySetReady();
    });

    async function prepare() {
      try {
        await Font.loadAsync({
          'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
          'SpaceMono-Bold': require('./assets/fonts/SpaceMono-Bold.ttf'),
        });
      } catch (e) {
        console.warn('Font loading failed:', e);
      }
      try {
        await requestNotificationPermissions();
      } catch (e) {
        console.warn('Notification permissions failed:', e);
      }
      try {
        await initializePurchases();
        useStore.getState().syncSubscriptionStatus();
      } catch (e) {
        console.warn('RevenueCat init failed:', e);
      }
      fontsDone = true;
      trySetReady();
    }

    prepare();

    return unsub;
  }, []);

  // Once ready, determine if onboarding is needed
  const handleSplashFinish = () => {
    const hasOnboarded = useStore.getState().hasOnboarded;
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }
    setSplashDone(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (!ready) {
    return <View style={styles.loading} />;
  }

  // Show animated splash first
  if (!splashDone) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <AnimatedSplash onFinish={handleSplashFinish} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  // Show onboarding if first launch
  if (showOnboarding) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
});
