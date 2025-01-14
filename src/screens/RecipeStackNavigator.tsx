import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, NavigationProp} from '@react-navigation/native';

import RecipesScreen from '../screens/RecipesScreen';
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen';

const Stack = createStackNavigator();


const RecipeStackNavigator = ({ route }: { route: any }) => {
  const navigation = useNavigation<NavigationProp<{ RecipeDetails: any }>>();
  const { recipes } = route.params || {};
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecipesPage"
        component={RecipesScreen}
        options={{ headerShown: false }} // Hides the header for the main recipes screen
        initialParams={recipes ? { recipes } : undefined}
      />
      <Stack.Screen
        name="RecipeDetails"
        component={RecipeDetailsScreen}
        options={{ title: 'Recipe Details' }} // Header for individual recipe details
      />
    </Stack.Navigator>
  );
};

export default RecipeStackNavigator;

