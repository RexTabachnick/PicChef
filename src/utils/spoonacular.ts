import axios from 'axios';

const SPOONACULAR_API_KEY = '7ab36354e4e3463cac8d9ee6fc2c71c2'; // Replace with your actual Spoonacular API key
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

export const fetchRecipesByIngredients = async (ingredients: string[]) => {
  try {
    const ingredientString = ingredients.join(',');
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/findByIngredients`, {
      params: {
        ingredients: ingredientString,
        number: 10, // Limit the number of recipes returned
        ranking: 1, // Minimize unused ingredients
        apiKey: SPOONACULAR_API_KEY,
      },
    });

    return response.data; // Array of recipes
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw new Error('Failed to fetch recipes from Spoonacular.');
  }
};

