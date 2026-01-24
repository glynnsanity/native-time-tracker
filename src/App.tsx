import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ActivityInput from './components/ActivityInput';
import ActivityList from './components/ActivityList';
import { useActivities } from './hooks/useActivities';

const App: React.FC = () => {
  const { activities, addActivity, toggleActivityRunning, deleteActivity } = useActivities();

  return (
    <SafeAreaView style={styles.container}>
      <ActivityInput onAddActivity={addActivity} />
      <ActivityList activities={activities} onStartStop={toggleActivityRunning} onDelete={deleteActivity} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
    paddingTop: 16,
  },
});

export default App;
