import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './MainTabs';

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
};

export default Navigation;
