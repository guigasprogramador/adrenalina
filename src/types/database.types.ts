export type Leader = {
  id: string
  created_at?: string
  leader_id: string
  name: string
  meta: number
  completed: number
  percentage: number
  active: boolean
}

export type Database = {
  public: {
    Tables: {
      leaders: {
        Row: Leader
        Insert: Omit<Leader, 'id' | 'created_at'>
        Update: Partial<Omit<Leader, 'id' | 'created_at'>>
      }
    }
  }
}
