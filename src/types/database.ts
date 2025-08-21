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
    }
  }
}

export type JobPost = Database['public']['Tables']['JobPost']['Row']