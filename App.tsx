import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';  // Import SafeAreaProvider
import HomeScreen from './src/screens/HomeScreen';
import BlankScreen from './src/screens/BlankScreen';
import { initializeApp, getApps, getApp } from 'firebase/app'; // Core Firebase SDK
import { getDatabase, ref, set } from 'firebase/database'; // Firebase Realtime Database

const firebaseConfig = {
  apiKey: 'AIzaSyD9OOtn2yjeJjLI8MT8OkFvOjHhjEqT8gQ',
  authDomain: 'pantryaiapp-43a77.firebaseapp.com',
  databaseURL: 'https://pantryaiapp-43a77.firebaseio.com',
  projectId: 'pantryaiapp-43a77',
  storageBucket: 'pantryaiapp-43a77.firebasestorage.app',
  messagingSenderId: '187923511523',
  appId: '1:187923511523:ios:01c75ab0194d20ad686dd6',
};


if (!getApps().length) {
  initializeApp(firebaseConfig);
  console.log("Firebase initialized");
} else {
  console.log("Using existing Firebase app");
}

const database = getDatabase();

const writeDataToFirebase = (id: string, type: string, weight: number) => {
  const dbRef = ref(database, `scans/${id}`); // Create a reference for a unique scan
  set(dbRef, {
    type: type,
    weight: weight,
  })
    .then(() => {
      console.log("Data written to Firebase successfully!");
    })
    .catch((error) => {
      console.error("Error writing data to Firebase:", error);
    });
};


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
