import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { SettingsProvider } from './contexts/SettingsContext';
import Navigation from './navigation';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SettingsProvider>
        <Navigation />
      </SettingsProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
