import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import type { MainTabScreenProps } from '../../navigation/types';

type Props = MainTabScreenProps<'Timer'>;

const TimerScreen: React.FC<Props> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Timer</Text>
        <Text style={styles.subtitle}>Focus timer coming soon</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default TimerScreen;
