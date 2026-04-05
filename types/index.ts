export type GameStatus   = 'upcoming' | 'live' | 'completed'
export type CategoryType = 'sports' | 'cultural'
export type EventType    = 'sports' | 'cultural'

export interface Profile {
  id: string
  full_name: string | null
  is_admin: boolean
  created_at: string
}

export interface Category {
  id: number
  name: string
  type: CategoryType
}

export interface Game {
  id: number
  day: number
  start_time: string | null
  category_id: number | null
  event_name: string
  event_type: EventType

  // Sports head-to-head
  team_a: string
  team_b: string
  score_a: number
  score_b: number
  winner: string | null

  // Cultural / positional
  pos_1: string | null
  pos_2: string | null
  pos_3: string | null
  pos_4: string | null

  status: GameStatus
  venue: string | null
  created_at: string
  categories?: Category
}

export interface Announcement {
  id: number
  title: string | null
  body: string | null
  created_at: string
}

export interface GameWithCategory extends Game {
  categories: Category
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id'>
        Update: Partial<Omit<Category, 'id'>>
      }
      games: {
        Row: Game
        Insert: Omit<Game, 'id' | 'created_at'>
        Update: Partial<Omit<Game, 'id' | 'created_at'>>
      }
      announcements: {
        Row: Announcement
        Insert: Omit<Announcement, 'id' | 'created_at'>
        Update: Partial<Omit<Announcement, 'id' | 'created_at'>>
      }
    }
  }
}