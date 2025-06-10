'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IngredientSelectorProps {
  onIngredientsChange: (ingredients: string[]) => void
  className?: string
}

export function IngredientSelector({ onIngredientsChange, className }: IngredientSelectorProps) {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      const newIngredients = [...ingredients, inputValue.trim()]
      setIngredients(newIngredients)
      onIngredientsChange(newIngredients)
      setInputValue('')
    }
  }

  const removeIngredient = (ingredient: string) => {
    const newIngredients = ingredients.filter(i => i !== ingredient)
    setIngredients(newIngredients)
    onIngredientsChange(newIngredients)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addIngredient()
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add an ingredient..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <button
          onClick={addIngredient}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </button>
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient) => (
            <span
              key={ingredient}
              className="inline-flex items-center space-x-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{ingredient}</span>
              <button
                onClick={() => removeIngredient(ingredient)}
                className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
