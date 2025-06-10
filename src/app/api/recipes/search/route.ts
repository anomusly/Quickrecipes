import { NextRequest, NextResponse } from 'next/server'
import { searchRecipesByIngredients, searchRecipesByQuery } from '@/lib/recipe-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ingredients = searchParams.get('ingredients')
    const query = searchParams.get('query')
    const maxReadyTime = searchParams.get('maxReadyTime')
    const diet = searchParams.get('diet')
    const number = searchParams.get('number')

    const options = {
      ...(maxReadyTime && { maxReadyTime: parseInt(maxReadyTime) }),
      ...(diet && { diet }),
      ...(number && { number: parseInt(number) })
    }

    let recipes
    if (ingredients) {
      const ingredientList = ingredients.split(',').map(ing => ing.trim()).filter(Boolean)
      recipes = await searchRecipesByIngredients(ingredientList, options)
    } else if (query) {
      recipes = await searchRecipesByQuery(query, options)
    } else {
      return NextResponse.json({ error: 'Either ingredients or query parameter is required' }, { status: 400 })
    }

    return NextResponse.json({ recipes, count: recipes.length })
  } catch (error) {
    console.error('Recipe search error:', error)
    return NextResponse.json({ error: 'Failed to search recipes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ingredients, query, filters } = body

    const options = {
      maxReadyTime: filters?.maxReadyTime,
      diet: filters?.diet,
      intolerances: filters?.intolerances,
      number: filters?.number || 12
    }

    let recipes
    if (ingredients && ingredients.length > 0) {
      recipes = await searchRecipesByIngredients(ingredients, options)
    } else if (query) {
      recipes = await searchRecipesByQuery(query, options)
    } else {
      return NextResponse.json({ error: 'Either ingredients or query is required' }, { status: 400 })
    }

    return NextResponse.json({ recipes, count: recipes.length })
  } catch (error) {
    console.error('Recipe search error:', error)
    return NextResponse.json({ error: 'Failed to search recipes' }, { status: 500 })
  }
}
