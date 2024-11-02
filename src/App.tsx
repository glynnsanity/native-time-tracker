import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import TimeTrackingApp from './components/TimeTrackingApp';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TimeTrackingApp />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
