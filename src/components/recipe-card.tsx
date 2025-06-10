'use client'

import { Clock, Users, Star, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface Recipe {
  id: string
  title: string
  description: string
  cookTime: number
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  rating: number
  image?: string
  ingredients: string[]
  matchPercentage?: number
}

interface RecipeCardProps {
  recipe: Recipe
  className?: string
  onFavorite?: (recipeId: string) => void
  isFavorited?: boolean
}

export function RecipeCard({ recipe, className, onFavorite, isFavorited = false }: RecipeCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const handleFavorite = () => {
    onFavorite?.(recipe.id)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className={cn(
      "bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden",
      className
    )}>
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">🍳</span>
          </div>
        )}
        
        {/* Match Percentage */}
        {recipe.matchPercentage && (
          <div className="absolute top-3 left-3 bg-orange-600 text-white px-2 py-1 rounded-full text-sm font-medium">
            {recipe.matchPercentage}% match
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
        >
          <Heart className={cn(
            "h-5 w-5 transition-colors",
            isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
          )} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{recipe.title}</h3>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0",
            getDifficultyColor(recipe.difficulty)
          )}>
            {recipe.difficulty}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>

        {/* Recipe Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.cookTime} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{recipe.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Ingredients Preview */}
        <div className="flex flex-wrap gap-1">
          {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {ingredient}
            </span>
          ))}
          {recipe.ingredients.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{recipe.ingredients.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
