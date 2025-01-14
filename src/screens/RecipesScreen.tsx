import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Image, TouchableOpacity } from 'react-native';
import { colors } from '../utils/styles';
import { useNavigation, NavigationProp} from '@react-navigation/native';


const RecipesScreen = ({ route }: { route: any }) => {
  const navigation = useNavigation<NavigationProp<{ RecipeDetails: any }>>();
  const { recipes = [] } = route.params || {};

  const openRecipeDetails = (recipe: any) => {
    navigation.navigate('RecipeDetails', { recipe });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.recipeItem} 
      onPress={() => openRecipeDetails(item)}
    >
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.recipeImage}
        />
      )}
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <Text style={styles.recipeInfo}>Used Ingredients: {item.usedIngredientCount}</Text>
      <Text style={styles.recipeInfo}>Missed Ingredients: {item.missedIngredientCount}</Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      {recipes && recipes.length > 0 ? (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      ) : (
        <Text style={styles.message}>Generate recipes first!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  recipeImage: {
    width: '100%', // Full width
    height: 200, // Fixed height
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover', // Scale to fit
  },
  recipeItem: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recipeInfo: {
    fontSize: 14,
    color: 'black',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
  noRecipesText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: colors.text,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default RecipesScreen;

