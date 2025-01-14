import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { database } from '../utils/firebase'; // Import Firebase config
import { ref, onValue } from 'firebase/database'; // Import Firebase methods
import { useNavigation, NavigationProp} from '@react-navigation/native';
import axios from 'axios';
import { colors } from '../utils/styles';

type IngredientsScreenNavigationProp = NavigationProp<{
  Recipes: any;
}>;

const IngredientsScreen = () => {
  const [ingredients, setIngredients] = useState<{ type: string; weight: string }[]>([]);
  const navigation = useNavigation<IngredientsScreenNavigationProp>();


  // Fetch ingredients from Firebase
  useEffect(() => {
    const ingredientsRef = ref(database, 'ingredients/');
    const unsubscribe = onValue(ingredientsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ingredientArray = Object.keys(data).map((key) => ({
          type: key,
          weight: data[key].weight,
        }));
        setIngredients(ingredientArray);
      } else {
        setIngredients([]); // No ingredients found
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  // Handle navigation to Recipes Screen
  const navigateToRecipes = async () => {
    if (ingredients.length === 0) {
      Alert.alert('No Ingredients', 'You must have at least one ingredient to generate recipes.');
      return;
    }
    
    try {
      // Fetch recipes from Spoonacular API
      const apiKey = '7ab36354e4e3463cac8d9ee6fc2c71c2';
      const ingredientList = ingredients.map((ingredient) => ingredient.type).join(',');

      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientList}&number=10&ranking=2&apiKey=${apiKey}`
      );''

      const recipes = response.data; // This returns an array of recipes
  
      // Navigate to Recipes screen with recipes as params
      if (recipes.length > 0) {
        navigation.navigate('Recipes', { recipes }); // Pass recipes data to RecipesScreen
      } else {
        Alert.alert('No Recipes Found', 'No recipes matched your ingredients.');
      }

    } catch (error) {
      console.error('Error fetching recipes:', error);
      Alert.alert('Error', 'Failed to generate recipes. Please try again.');
    }
  };

  // Render each ingredient
  const renderIngredient = ({ item }: { item: { type: string; weight: string } }) => (
    <View style={styles.ingredientItem}>
      <Text style={styles.ingredientText}>{`Type: ${item.type}`}</Text>
      <Text style={styles.ingredientText}>{`Weight: ${item.weight}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingredients</Text>
      {ingredients.length > 0 ? (
        <FlatList
          data={ingredients}
          keyExtractor={(item) => item.type}
          renderItem={renderIngredient}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.emptyMessage}>No ingredients detected yet. Please capture some photos first.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={navigateToRecipes}>
        <Text style={styles.buttonText}>Generate Recipes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ingredientText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyMessage: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'tomato',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IngredientsScreen;