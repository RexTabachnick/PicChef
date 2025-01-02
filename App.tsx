import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';  // Import SafeAreaProvider
import HomeScreen from './src/screens/HomeScreen';
import BlankScreen from './src/screens/BlankScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SafeAreaProvider> 
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
              let iconName = '';
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home';
              } else if (route.name === 'Blank') {
                iconName = focused ? 'layers' : 'layers';
              }

              if (!iconName) {
                return null;
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Blank" component={BlankScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
