export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          additional_info: string | null
          agree_terms: boolean
          available_days: string[]
          company_id: string | null
          created_at: string
          id: string
          job_id: string
          name: string | null
          next_date: string | null
          next_step: string | null
          start_date: string
          status: string
          title: string | null
          user_id: string
        }
        Insert: {
          additional_info?: string | null
          agree_terms?: boolean
          available_days: string[]
          company_id?: string | null
          created_at?: string
          id?: string
          job_id: string
          name?: string | null
          next_date?: string | null
          next_step?: string | null
          start_date: string
          status?: string
          title?: string | null
          user_id: string
        }
        Update: {
          additional_info?: string | null
          agree_terms?: boolean
          available_days?: string[]
          company_id?: string | null
          created_at?: string
          id?: string
          job_id?: string
          name?: string | null
          next_date?: string | null
          next_step?: string | null
          start_date?: string
          status?: string
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          application_id: string
          created_at: string | null
          id: number
        }
        Insert: {
          application_id: string
          created_at?: string | null
          id?: number
        }
        Update: {
          application_id?: string
          created_at?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_rooms_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "company_chat_rooms_view"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "chat_rooms_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "company_chat_rooms_view"
            referencedColumns: ["chat_room_id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          email: string
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          phone: string | null
          size: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          size?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          size?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      feedback_templates: {
        Row: {
          category: string
          company_id: string
          created_at: string | null
          created_by: string | null
          default_comments: Json | null
          description: string | null
          evaluation_criteria: Json
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string | null
          created_by?: string | null
          default_comments?: Json | null
          description?: string | null
          evaluation_criteria: Json
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          default_comments?: Json | null
          description?: string | null
          evaluation_criteria?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          assignee: string
          attachments: Json | null
          content: string
          created_at: string | null
          id: string
          improvements: Json | null
          internal_memo: string | null
          internship_id: string
          overall_comment: string | null
          rating: number
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          strengths: Json | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          assignee: string
          attachments?: Json | null
          content: string
          created_at?: string | null
          id?: string
          improvements?: Json | null
          internal_memo?: string | null
          internship_id: string
          overall_comment?: string | null
          rating: number
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          strengths?: Json | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assignee?: string
          attachments?: Json | null
          content?: string
          created_at?: string | null
          id?: string
          improvements?: Json | null
          internal_memo?: string | null
          internship_id?: string
          overall_comment?: string | null
          rating?: number
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          strengths?: Json | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "feedback_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          applicant_id: string
          company_id: string
          created_at: string
          date: string
          end_time: string
          evaluation: string | null
          id: number
          interviewer: string | null
          job_id: string
          location: string | null
          meeting_link: string | null
          notes: string | null
          priority: string
          start_time: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          company_id: string
          created_at?: string
          date: string
          end_time: string
          evaluation?: string | null
          id?: number
          interviewer?: string | null
          job_id: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          priority?: string
          start_time: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          company_id?: string
          created_at?: string
          date?: string
          end_time?: string
          evaluation?: string | null
          id?: number
          interviewer?: string | null
          job_id?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          priority?: string
          start_time?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "interviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          benefits: string[] | null
          category: string
          company_id: string
          created_at: string | null
          description: string
          duration: string | null
          frequency: string | null
          id: string
          location: string | null
          mentor_experience: string | null
          mentor_message: string | null
          mentor_name: string | null
          mentor_role: string | null
          publish_date: string | null
          remote: boolean | null
          remote_details: string | null
          requirements: string[] | null
          responsibilities: string[] | null
          salary: number | null
          salary_type: string | null
          search_vector: unknown | null
          selection_steps: Json | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          work_days: string[] | null
          work_hours: string | null
        }
        Insert: {
          benefits?: string[] | null
          category: string
          company_id: string
          created_at?: string | null
          description: string
          duration?: string | null
          frequency?: string | null
          id?: string
          location?: string | null
          mentor_experience?: string | null
          mentor_message?: string | null
          mentor_name?: string | null
          mentor_role?: string | null
          publish_date?: string | null
          remote?: boolean | null
          remote_details?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary?: number | null
          salary_type?: string | null
          search_vector?: unknown | null
          selection_steps?: Json | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          work_days?: string[] | null
          work_hours?: string | null
        }
        Update: {
          benefits?: string[] | null
          category?: string
          company_id?: string
          created_at?: string | null
          description?: string
          duration?: string | null
          frequency?: string | null
          id?: string
          location?: string | null
          mentor_experience?: string | null
          mentor_message?: string | null
          mentor_name?: string | null
          mentor_role?: string | null
          publish_date?: string | null
          remote?: boolean | null
          remote_details?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary?: number | null
          salary_type?: string | null
          search_vector?: unknown | null
          selection_steps?: Json | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          work_days?: string[] | null
          work_hours?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          application_id: string
          content: string
          created_at: string
          id: string
          is_read: boolean
          sender: string
          type: string
        }
        Insert: {
          application_id: string
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender: string
          type?: string
        }
        Update: {
          application_id?: string
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "company_chat_rooms_view"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "company_chat_rooms_view"
            referencedColumns: ["chat_room_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          faculty: string | null
          first_name: string | null
          full_name: string | null
          last_name: string | null
          location: string | null
          phone: string | null
          university: string | null
          user_id: string
          year: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          faculty?: string | null
          first_name?: string | null
          full_name?: string | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          university?: string | null
          user_id: string
          year?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          faculty?: string | null
          first_name?: string | null
          full_name?: string | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          university?: string | null
          user_id?: string
          year?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          faculty: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          location: string | null
          major: string
          name: string
          phone: string | null
          status: string | null
          university: string
          updated_at: string | null
          user_id: string | null
          year: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          faculty?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          major: string
          name: string
          phone?: string | null
          status?: string | null
          university: string
          updated_at?: string | null
          user_id?: string | null
          year: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          faculty?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          major?: string
          name?: string
          phone?: string | null
          status?: string | null
          university?: string
          updated_at?: string | null
          user_id?: string | null
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      company_chat_rooms_view: {
        Row: {
          applicant_name: string | null
          application_id: string | null
          application_status: string | null
          application_title: string | null
          chat_room_id: string | null
          job_title: string | null
          last_message: string | null
          last_message_at: string | null
          unread_count: number | null
        }
        Relationships: []
      }
      student_chat_rooms_view: {
        Row: {
          company_logo: string | null
          company_name: string | null
          has_attachment: boolean | null
          job_title: string | null
          last_message: string | null
          last_message_at: string | null
          room_id: number | null
          status: string | null
          student_id: string | null
          unread_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
