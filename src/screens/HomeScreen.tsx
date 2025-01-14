import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/styles';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  welcomeText: {
    color: 'purple', // Sets the text color to purple
    fontSize: 25, // Optional: Adjust the font size as needed
  },
});

export default HomeScreen;
