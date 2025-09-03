import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Monastery {
  id: string
  name: string
  short_description: string
  full_description: string
  year_founded: number
  latitude: number
  longitude: number
  address: string
  main_image: string
  gallery_images: string[]
  panorama_url?: string
  audio_narration?: string
  visit_count: number
  cleanliness_rating: number
  created_at: string
  updated_at: string
}

export interface CulturalEvent {
  id: string
  monastery_id: string
  name: string
  date: string
  description: string
  created_at: string
}

export interface Archive {
  id: string
  monastery_id: string
  title: string
  type: 'artifact' | 'artwork' | 'manuscript' | 'photograph'
  thumbnail: string
  full_image: string
  caption: string
  metadata: {
    date?: string
    material?: string
    artist?: string
    significance?: string
    language?: string
  }
  created_at: string
}

export interface Weather {
  monastery_id: string
  temperature: number
  condition: string
  humidity: number
  visibility: number
  updated_at: string
}