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
            foreignKeyName: "feedbacks_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedbacks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "feedback_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      internships: {
        Row: {
          company_id: string
          created_at: string | null
          department: string
          end_date: string
          id: string
          job_name: string
          job_title: string
          mentor_name: string | null
          start_date: string
          status: string | null
          student_id: string
          total_hours: number | null
          updated_at: string | null
          work_days: number | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          department: string
          end_date: string
          id?: string
          job_name: string
          job_title: string
          mentor_name?: string | null
          start_date: string
          status?: string | null
          student_id: string
          total_hours?: number | null
          updated_at?: string | null
          work_days?: number | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          department?: string
          end_date?: string
          id?: string
          job_name?: string
          job_title?: string
          mentor_name?: string | null
          start_date?: string
          status?: string | null
          student_id?: string
          total_hours?: number | null
          updated_at?: string | null
          work_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "internships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internships_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          location: string | null
          major: string
          name: string
          phone: string | null
          status: string | null
          university: string
          updated_at: string | null
          year: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          location?: string | null
          major: string
          name: string
          phone?: string | null
          status?: string | null
          university: string
          updated_at?: string | null
          year: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          location?: string | null
          major?: string
          name?: string
          phone?: string | null
          status?: string | null
          university?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
