import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create a mock client for development if no real credentials are provided
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  created_at: string
}

export interface UserIngredient {
  id: string
  user_id: string
  ingredient_name: string
  quantity: string | null
  expiry_date: string | null
  created_at: string
}

export interface FavoriteRecipe {
  id: string
  user_id: string
  recipe_id: string
  recipe_title: string
  recipe_image: string | null
  created_at: string
}

export interface RecipeHistory {
  id: string
  user_id: string
  recipe_id: string
  recipe_title: string
  cooked_at: string
}
