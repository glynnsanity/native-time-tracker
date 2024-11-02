import React, { useState, useEffect, useCallback } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { debounce } from 'lodash';
import { Activity, Timer } from '../types';

interface ActivityInputProps {
  timer: Timer;
  activity: Activity;
  handleUpdateActivity: (newTime: number) => void;
}

function ActivityInput({ timer, activity, handleUpdateActivity }: ActivityInputProps) {
  const [inputValue, setInputValue] = useState<string>(activity.time.toFixed(2));
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  useEffect(() => {
    setInputValue(activity.time.toFixed(2));
  }, [activity.time]);

  const debouncedHandleUpdateActivity = useCallback(
    debounce((value: number) => {
      handleUpdateActivity(value);
    }, 300),
    [handleUpdateActivity]
  );

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setIsInvalid(false);
  };

  const handleBlur = () => {
    updateActivityTime();
  };

  const updateActivityTime = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value >= 0) {
      const roundedValue = parseFloat(value.toFixed(2));
      if (roundedValue !== activity.time) {
        debouncedHandleUpdateActivity(roundedValue);
      }
    } else {
      setInputValue(activity.time.toFixed(2));
      setIsInvalid(true);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        keyboardType="numeric"
        value={inputValue}
        onChangeText={handleInputChange}
        onBlur={handleBlur}
        editable={!timer.isActive}
        style={[styles.input, isInvalid && styles.invalidInput]}
        aria-label={`Edit time for ${activity.name}`}
      />
      {isInvalid && <Text style={styles.errorText}>Invalid input</Text>}
    </View>
  );
}

export default React.memo(ActivityInput);

// Styles for the component
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: 80,
    fontSize: 16,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  invalidInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
