import SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

async function delaySplash() {
  try {
    await SplashScreen.preventAutoHideAsync();
    await sleep(3000);
  } catch (e) {
    console.warn(e);
  } finally {
    await SplashScreen.hideAsync();
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const App = () => {
  const webviewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    delaySplash();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack) {
        webviewRef.current.goBack();
        return true;
      } else {
        BackHandler.exitApp();
      }
      return false;
    });

    return () => backHandler.remove();
  }, [canGoBack]);

  return (
    <SafeAreaProvider>
      <AppContent webviewRef={webviewRef} canGoBack={canGoBack} setCanGoBack={setCanGoBack} />
    </SafeAreaProvider>
  );
};

const AppContent = ({ webviewRef, canGoBack, setCanGoBack }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#343a40', flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://beta.daon.today/' }}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
      />
    </View>
  );
};

export default App;
