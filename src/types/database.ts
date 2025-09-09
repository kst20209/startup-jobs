export interface Database {
  public: {
    Tables: {
      JobPost: {
        Row: {
          id: number
          company_name: string
          company_name_detail: string
          job_title: string
          job_url: string
          job_category_main: string
          job_category_sub: string
          employment_type: string
          location: string
          deadline_date: string | null
          job_description: string | null
          requirements: string | null
          preferred_qualifications: string | null
          raw_id: number | null
          contract_duration: string | null
          is_liberal: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          company_name: string
          company_name_detail: string
          job_title: string
          job_url: string
          job_category_main: string
          job_category_sub: string
          employment_type: string
          location: string
          deadline_date?: string | null
          job_description?: string | null
          requirements?: string | null
          preferred_qualifications?: string | null
          raw_id?: number | null
          contract_duration?: string | null
          is_liberal?: boolean
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          company_name?: string
          company_name_detail?: string
          job_title?: string
          job_url?: string
          job_category_main?: string
          job_category_sub?: string
          employment_type?: string
          location?: string
          deadline_date?: string | null
          job_description?: string | null
          requirements?: string | null
          preferred_qualifications?: string | null
          raw_id?: number | null
          contract_duration?: string | null
          is_liberal?: boolean
          is_active?: boolean
          created_at?: string
        }
      }
      search_logs: {
        Row: {
          id: string
          search_term: string
          user_ip: string | null
          user_agent: string | null
          created_at: string | null
          session_id: string | null
        }
        Insert: {
          id?: string
          search_term: string
          user_ip?: string | null
          user_agent?: string | null
          created_at?: string | null
          session_id?: string | null
        }
        Update: {
          id?: string
          search_term?: string
          user_ip?: string | null
          user_agent?: string | null
          created_at?: string | null
          session_id?: string | null
        }
      }
    }
  }
}

export type JobPost = Database['public']['Tables']['JobPost']['Row']
export type SearchLog = Database['public']['Tables']['search_logs']['Row']