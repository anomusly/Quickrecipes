// Recipe API service using Spoonacular
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes'
const API_KEY = process.env.SPOONACULAR_API_KEY

export interface SpoonacularRecipe {
  id: number
  title: string
  image: string
  readyInMinutes: number
  servings: number
  summary: string
  instructions: string
  extendedIngredients: Array<{
    id: number
    name: string
    amount: number
    unit: string
  }>
  nutrition?: {
    nutrients: Array<{
      name: string
      amount: number
      unit: string
    }>
  }
  spoonacularScore: number
  healthScore: number
}

export interface Recipe {
  id: string
  title: string
  description: string
  cookTime: number
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  rating: number
  image?: string
  ingredients: string[]
  instructions?: string[]
  matchPercentage?: number
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

// Convert Spoonacular recipe to our Recipe format
function convertSpoonacularRecipe(spoonacularRecipe: SpoonacularRecipe, userIngredients: string[] = []): Recipe {
  const ingredients = spoonacularRecipe.extendedIngredients.map(ing => ing.name)
  
  // Calculate match percentage
  const matchPercentage = userIngredients.length > 0 
    ? Math.round((userIngredients.filter(userIng => 
        ingredients.some(recipeIng => 
          recipeIng.toLowerCase().includes(userIng.toLowerCase()) ||
          userIng.toLowerCase().includes(recipeIng.toLowerCase())
        )
      ).length / userIngredients.length) * 100)
    : undefined

  // Determine difficulty based on cook time and ingredient count
  let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy'
  if (spoonacularRecipe.readyInMinutes > 45 || ingredients.length > 10) {
    difficulty = 'Hard'
  } else if (spoonacularRecipe.readyInMinutes > 25 || ingredients.length > 6) {
    difficulty = 'Medium'
  }

  // Extract nutrition info
  const nutrition = spoonacularRecipe.nutrition ? {
    calories: spoonacularRecipe.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 0,
    protein: spoonacularRecipe.nutrition.nutrients.find(n => n.name === 'Protein')?.amount || 0,
    carbs: spoonacularRecipe.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0,
    fat: spoonacularRecipe.nutrition.nutrients.find(n => n.name === 'Fat')?.amount || 0,
  } : undefined

  return {
    id: spoonacularRecipe.id.toString(),
    title: spoonacularRecipe.title,
    description: spoonacularRecipe.summary.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
    cookTime: spoonacularRecipe.readyInMinutes,
    servings: spoonacularRecipe.servings,
    difficulty,
    rating: Math.round((spoonacularRecipe.spoonacularScore / 20) * 10) / 10, // Convert to 5-star scale
    image: spoonacularRecipe.image,
    ingredients,
    instructions: spoonacularRecipe.instructions ? 
      spoonacularRecipe.instructions.split('.').filter(step => step.trim().length > 10) : undefined,
    matchPercentage,
    nutrition
  }
}

// Search recipes by ingredients
export async function searchRecipesByIngredients(
  ingredients: string[], 
  options: {
    maxReadyTime?: number
    diet?: string
    intolerances?: string
    number?: number
  } = {}
): Promise<Recipe[]> {
  if (!API_KEY) {
    console.warn('Spoonacular API key not found, returning mock data')
    return getMockRecipes(ingredients)
  }

  try {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      ingredients: ingredients.join(','),
      number: (options.number || 12).toString(),
      ranking: '2', // Maximize used ingredients
      ignorePantry: 'true',
      ...(options.maxReadyTime && { maxReadyTime: options.maxReadyTime.toString() }),
      ...(options.diet && { diet: options.diet }),
      ...(options.intolerances && { intolerances: options.intolerances })
    })

    const response = await fetch(`${SPOONACULAR_BASE_URL}/findByIngredients?${params}`)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const recipes = await response.json()
    
    // Get detailed information for each recipe
    const detailedRecipes = await Promise.all(
      recipes.slice(0, 6).map(async (recipe: any) => {
        try {
          const detailResponse = await fetch(
            `${SPOONACULAR_BASE_URL}/${recipe.id}/information?apiKey=${API_KEY}&includeNutrition=true`
          )
          if (detailResponse.ok) {
            const detailedRecipe = await detailResponse.json()
            return convertSpoonacularRecipe(detailedRecipe, ingredients)
          }
        } catch (error) {
          console.error(`Error fetching recipe ${recipe.id}:`, error)
        }
        return null
      })
    )

    return detailedRecipes.filter(recipe => recipe !== null) as Recipe[]
  } catch (error) {
    console.error('Error searching recipes:', error)
    return getMockRecipes(ingredients)
  }
}

// Search recipes by query
export async function searchRecipesByQuery(
  query: string,
  options: {
    maxReadyTime?: number
    diet?: string
    number?: number
  } = {}
): Promise<Recipe[]> {
  if (!API_KEY) {
    return getMockRecipes([])
  }

  try {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      query,
      number: (options.number || 12).toString(),
      addRecipeInformation: 'true',
      ...(options.maxReadyTime && { maxReadyTime: options.maxReadyTime.toString() }),
      ...(options.diet && { diet: options.diet })
    })

    const response = await fetch(`${SPOONACULAR_BASE_URL}/complexSearch?${params}`)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.results.map((recipe: SpoonacularRecipe) => convertSpoonacularRecipe(recipe))
  } catch (error) {
    console.error('Error searching recipes by query:', error)
    return getMockRecipes([])
  }
}

// Mock data for development/fallback
function getMockRecipes(userIngredients: string[] = []): Recipe[] {
  const mockRecipes = [
    {
      id: '1',
      title: 'Quick Chicken Fried Rice',
      description: 'Delicious fried rice with chicken, eggs, and vegetables. Perfect for using up leftover rice.',
      cookTime: 15,
      servings: 4,
      difficulty: 'Easy' as const,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
      ingredients: ['chicken breast', 'cooked rice', 'eggs', 'soy sauce', 'mixed vegetables', 'garlic', 'ginger'],
      instructions: [
        'Heat oil in a large pan or wok over high heat',
        'Add diced chicken and cook until golden brown',
        'Push chicken to one side, scramble eggs on the other side',
        'Add rice, breaking up any clumps',
        'Stir in vegetables, soy sauce, garlic, and ginger',
        'Cook for 3-4 minutes until heated through'
      ]
    },
    {
      id: '2',
      title: 'Creamy Tomato Pasta',
      description: 'Rich and creamy pasta with fresh tomatoes, garlic, and herbs. Ready in under 20 minutes.',
      cookTime: 18,
      servings: 3,
      difficulty: 'Easy' as const,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
      ingredients: ['pasta', 'canned tomatoes', 'heavy cream', 'garlic', 'basil', 'parmesan cheese', 'olive oil'],
      instructions: [
        'Cook pasta according to package directions',
        'Heat olive oil in a large pan, add minced garlic',
        'Add canned tomatoes and simmer for 5 minutes',
        'Stir in heavy cream and fresh basil',
        'Add cooked pasta and toss to combine',
        'Serve with grated parmesan cheese'
      ]
    },
    {
      id: '3',
      title: 'Mediterranean Chicken Salad',
      description: 'Fresh and healthy salad with grilled chicken, olives, feta cheese, and Mediterranean vegetables.',
      cookTime: 12,
      servings: 2,
      difficulty: 'Easy' as const,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
      ingredients: ['chicken breast', 'mixed greens', 'cherry tomatoes', 'cucumber', 'red onion', 'feta cheese', 'olives', 'olive oil', 'lemon juice'],
      instructions: [
        'Season and grill chicken breast until cooked through',
        'Let chicken rest, then slice into strips',
        'Combine mixed greens, tomatoes, cucumber, and red onion',
        'Add sliced chicken, feta cheese, and olives',
        'Drizzle with olive oil and lemon juice',
        'Toss gently and serve immediately'
      ]
    }
  ]

  // Calculate match percentage for mock recipes
  return mockRecipes.map(recipe => ({
    ...recipe,
    matchPercentage: userIngredients.length > 0 
      ? Math.round((userIngredients.filter(userIng => 
          recipe.ingredients.some(recipeIng => 
            recipeIng.toLowerCase().includes(userIng.toLowerCase()) ||
            userIng.toLowerCase().includes(recipeIng.toLowerCase())
          )
        ).length / userIngredients.length) * 100)
      : undefined
  }))
}
