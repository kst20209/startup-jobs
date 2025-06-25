export interface Database {
  public: {
    Tables: {
      JobPost: {
        Row: {
          id: number
          company_name: string
          job_title: string
          job_url: string
          position: string
          employment_type: string
          created_at: string
        }
        Insert: {
          id?: number
          company_name: string
          job_title: string
          job_url: string
          position: string
          employment_type: string
          created_at?: string
        }
        Update: {
          id?: number
          company_name?: string
          job_title?: string
          job_url?: string
          position?: string
          employment_type?: string
          created_at?: string
        }
      }
    }
  }
}

export type JobPost = Database['public']['Tables']['JobPost']['Row']