'use client'

import { useState, useEffect } from 'react'
import { ChefHat, Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { IngredientSelector } from '@/components/ingredient-selector'
import { RecipeCard } from '@/components/recipe-card'
import { Recipe } from '@/lib/recipe-api'

export default function Dashboard() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [maxCookTime, setMaxCookTime] = useState<number | null>(null)
  const [difficulty, setDifficulty] = useState<string>('')

  // Search recipes function
  const searchRecipes = async () => {
    if (selectedIngredients.length === 0 && !searchQuery.trim()) {
      setRecipes([])
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (selectedIngredients.length > 0) {
        params.append('ingredients', selectedIngredients.join(','))
      }

      if (searchQuery.trim()) {
        params.append('query', searchQuery.trim())
      }

      if (maxCookTime) {
        params.append('maxReadyTime', maxCookTime.toString())
      }

      const response = await fetch(`/api/recipes/search?${params}`)
      const data = await response.json()

      if (response.ok) {
        setRecipes(data.recipes || [])
      } else {
        console.error('Recipe search failed:', data.error)
        setRecipes([])
      }
    } catch (error) {
      console.error('Error searching recipes:', error)
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  // Search when ingredients or query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchRecipes()
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [selectedIngredients, searchQuery, maxCookTime])

  // Load initial recipes
  useEffect(() => {
    searchRecipes()
  }, [])

  const handleFavorite = (recipeId: string) => {
    setFavorites(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    )
  }

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
                      <select
                        value={maxCookTime || ''}
                        onChange={(e) => setMaxCookTime(e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Any time</option>
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Difficulty
                      </label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Any difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
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
                  : searchQuery
                    ? `Search results for "${searchQuery}"`
                    : 'Discover Recipes'
                }
              </h1>
              <div className="flex items-center space-x-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin text-orange-600" />}
                <p className="text-gray-600">
                  {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            {/* Recipe Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onFavorite={handleFavorite}
                    isFavorited={favorites.includes(recipe.id)}
                  />
                ))}
              </div>
            )}

            {!loading && recipes.length === 0 && (selectedIngredients.length > 0 || searchQuery.trim()) && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or adding different ingredients
                </p>
              </div>
            )}

            {!loading && recipes.length === 0 && selectedIngredients.length === 0 && !searchQuery.trim() && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍳</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to cook?</h3>
                <p className="text-gray-600">
                  Add some ingredients or search for recipes to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
