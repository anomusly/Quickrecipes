'use client'

import { useState } from 'react'
import { ChefHat, Search, Filter, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { IngredientSelector } from '@/components/ingredient-selector'
import { RecipeCard } from '@/components/recipe-card'

// Mock recipe data
const mockRecipes = [
  {
    id: '1',
    title: 'Chicken Fried Rice',
    description: 'Quick and delicious fried rice with chicken and vegetables',
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy' as const,
    rating: 4.5,
    ingredients: ['chicken', 'rice', 'eggs', 'soy sauce', 'vegetables'],
    matchPercentage: 95
  },
  {
    id: '2',
    title: 'Tomato Pasta',
    description: 'Simple pasta with fresh tomatoes and herbs',
    cookTime: 20,
    servings: 2,
    difficulty: 'Easy' as const,
    rating: 4.2,
    ingredients: ['pasta', 'tomatoes', 'garlic', 'basil', 'olive oil'],
    matchPercentage: 80
  },
  {
    id: '3',
    title: 'Chicken Caesar Salad',
    description: 'Fresh salad with grilled chicken and caesar dressing',
    cookTime: 10,
    servings: 2,
    difficulty: 'Easy' as const,
    rating: 4.7,
    ingredients: ['chicken', 'lettuce', 'parmesan', 'croutons', 'caesar dressing'],
    matchPercentage: 75
  }
]

export default function Dashboard() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const handleFavorite = (recipeId: string) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    )
  }

  const filteredRecipes = mockRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesIngredients = selectedIngredients.length === 0 || 
                              selectedIngredients.some(ingredient => 
                                recipe.ingredients.some(recipeIngredient => 
                                  recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
                                )
                              )
    
    return matchesSearch && matchesIngredients
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900">QuickRecipes</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-orange-600 font-medium">
                Dashboard
              </Link>
              <Link href="/favorites" className="text-gray-600 hover:text-orange-600 transition-colors">
                Favorites ({favorites.length})
              </Link>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                Profile
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Find Recipes</h2>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Recipes
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Ingredients
                </label>
                <IngredientSelector onIngredientsChange={setSelectedIngredients} />
              </div>

              {/* Filters */}
              <div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                
                {showFilters && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Max Cook Time
                      </label>
                      <select className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2">
                        <option>Any time</option>
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Difficulty
                      </label>
                      <select className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2">
                        <option>Any difficulty</option>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedIngredients.length > 0 
                  ? `Recipes with ${selectedIngredients.join(', ')}`
                  : 'All Recipes'
                }
              </h1>
              <p className="text-gray-600">
                {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Recipe Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onFavorite={handleFavorite}
                  isFavorited={favorites.includes(recipe.id)}
                />
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or adding different ingredients
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
