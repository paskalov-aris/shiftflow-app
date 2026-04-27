import React from 'react';
import { StatusBar, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigation from './src/navigation/RootNavigation';
import { useAuthStore } from './src/stores/authStore';
import { useAuthListener } from './src/hooks/useAuthListener';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { isLoading } = useAuthStore();

  useAuthListener();

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#F7F3EE' }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RootNavigation />
    </SafeAreaProvider>
  );
}

export default App;
