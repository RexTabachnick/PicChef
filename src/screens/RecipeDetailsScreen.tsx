import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { colors } from '../utils/styles';

const RecipeDetailsScreen = ({ route }: { route: any }) => {
  const { recipe } = route.params || {};

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Recipe details not available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      {recipe.image && (
        <Image
          source={{ uri: recipe.image }}
          style={styles.recipeImage}
        />
      )}
      <Text style={styles.subtitle}>Ingredients:</Text>
      {recipe.ingredients ? (
        recipe.ingredients.map((ingredient: any, index: number) => (
          <Text key={index} style={styles.ingredientText}>
            {ingredient.original}
          </Text>
        ))
      ) : (
        <Text style={styles.errorText}>Ingredients not available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333', // Dark gray text
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#555', // Medium gray text
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover', // Scale to fit
  },
  ingredientText: {
    fontSize: 16,
    color: '#333', // Dark gray text
    marginBottom: 4,
    paddingLeft: 8, // Small indentation for a clean look
  },
  errorText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FF6347', // Tomato red for errors
    textAlign: 'center',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: colors.text,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
});

export default RecipeDetailsScreen;