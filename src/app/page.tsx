'use client'

import { useState } from 'react'
import { ChefHat, Search, Clock, Users, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [ingredients, setIngredients] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900">QuickRecipes</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/recipes" className="text-gray-600 hover:text-orange-600 transition-colors">
              Browse Recipes
            </Link>
            <Link href="/favorites" className="text-gray-600 hover:text-orange-600 transition-colors">
              Favorites
            </Link>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Sign In
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Cook Amazing Meals with
            <span className="text-orange-600 block">What You Have</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop wondering "what should I cook?" Just tell us what ingredients you have,
            and we'll find delicious recipes you can make right now.
          </p>

          {/* Ingredient Input */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center space-x-4">
              <Search className="h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Enter ingredients you have (e.g., chicken, rice, tomatoes)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="flex-1 text-lg border-none outline-none placeholder-gray-400"
              />
              <Link href="/dashboard" className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors flex items-center space-x-2">
                <span>Find Recipes</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">15 Minutes or Less</h3>
              <p className="text-gray-600">Quick recipes perfect for busy weeknights</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real Ingredients</h3>
              <p className="text-gray-600">No exotic ingredients - just what you have at home</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tested Recipes</h3>
              <p className="text-gray-600">Every recipe is tried and loved by home cooks</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
