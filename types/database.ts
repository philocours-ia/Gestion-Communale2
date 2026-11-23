export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          created_at: string
          details: Json
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: never
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: never
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          language: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          commune_name: string | null
          created_at: string
          file_size_bytes: number
          id: string
          issued_on: string | null
          issuing_authority: string | null
          jurisdiction: string | null
          knowledge_layer: string
          language: string | null
          metadata: Json
          mime_type: string
          notes: string | null
          original_filename: string
          reference_number: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          sha256: string | null
          storage_path: string
          tags: string[]
          title: string
          updated_at: string
          user_id: string
          verification_status: string
        }
        Insert: {
          category?: string
          commune_name?: string | null
          created_at?: string
          file_size_bytes: number
          id?: string
          issued_on?: string | null
          issuing_authority?: string | null
          jurisdiction?: string | null
          knowledge_layer?: string
          language?: string | null
          metadata?: Json
          mime_type: string
          notes?: string | null
          original_filename: string
          reference_number?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sha256?: string | null
          storage_path: string
          tags?: string[]
          title: string
          updated_at?: string
          user_id: string
          verification_status?: string
        }
        Update: {
          category?: string
          commune_name?: string | null
          created_at?: string
          file_size_bytes?: number
          id?: string
          issued_on?: string | null
          issuing_authority?: string | null
          jurisdiction?: string | null
          knowledge_layer?: string
          language?: string | null
          metadata?: Json
          mime_type?: string
          notes?: string | null
          original_filename?: string
          reference_number?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sha256?: string | null
          storage_path?: string
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
          verification_status?: string
        }
        Relationships: []
      }
      drafts: {
        Row: {
          body: string
          commune_name: string | null
          created_at: string
          document_type: string
          id: string
          language: string
          source_refs: Json
          status: string
          structured_data: Json
          title: string
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          body?: string
          commune_name?: string | null
          created_at?: string
          document_type: string
          id?: string
          language?: string
          source_refs?: Json
          status?: string
          structured_data?: Json
          title: string
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          body?: string
          commune_name?: string | null
          created_at?: string
          document_type?: string
          id?: string
          language?: string
          source_refs?: Json
          status?: string
          structured_data?: Json
          title?: string
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      education_courses: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: string
          level: string
          series_code: string
          status: string
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string
          id?: string
          level: string
          series_code: string
          status?: string
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          level?: string
          series_code?: string
          status?: string
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_courses_series_code_fkey"
            columns: ["series_code"]
            isOneToOne: false
            referencedRelation: "education_tracks"
            referencedColumns: ["track_code"]
          },
        ]
      }
      education_enrollments: {
        Row: {
          contact_phone: string | null
          created_at: string
          guardian_consent_confirmed: boolean
          id: string
          level: string
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          school_year: string
          series_code: string
          status: string
          student_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_phone?: string | null
          created_at?: string
          guardian_consent_confirmed?: boolean
          id?: string
          level: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_year?: string
          series_code: string
          status?: string
          student_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_phone?: string | null
          created_at?: string
          guardian_consent_confirmed?: boolean
          id?: string
          level?: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_year?: string
          series_code?: string
          status?: string
          student_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_enrollments_series_code_fkey"
            columns: ["series_code"]
            isOneToOne: false
            referencedRelation: "education_tracks"
            referencedColumns: ["track_code"]
          },
        ]
      }
      education_ledger: {
        Row: {
          amount_ariary: number
          category: string
          created_at: string
          created_by: string | null
          description: string
          direction: string
          entry_date: string
          id: string
          payment_id: string | null
        }
        Insert: {
          amount_ariary: number
          category: string
          created_at?: string
          created_by?: string | null
          description: string
          direction: string
          entry_date?: string
          id?: string
          payment_id?: string | null
        }
        Update: {
          amount_ariary?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          direction?: string
          entry_date?: string
          id?: string
          payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_ledger_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: true
            referencedRelation: "education_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      education_payments: {
        Row: {
          amount_ariary: number
          created_at: string
          enrollment_id: string
          id: string
          payment_method: string
          period_month: string
          proof_path: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          transaction_reference: string | null
          user_id: string
        }
        Insert: {
          amount_ariary?: number
          created_at?: string
          enrollment_id: string
          id?: string
          payment_method?: string
          period_month?: string
          proof_path: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          transaction_reference?: string | null
          user_id: string
        }
        Update: {
          amount_ariary?: number
          created_at?: string
          enrollment_id?: string
          id?: string
          payment_method?: string
          period_month?: string
          proof_path?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          transaction_reference?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_payment_user_matches_enrollment"
            columns: ["enrollment_id", "user_id"]
            isOneToOne: false
            referencedRelation: "education_enrollments"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "education_payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "education_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      education_progress: {
        Row: {
          activity_type: string
          course_id: string | null
          created_at: string
          feedback: string | null
          id: string
          mastery_status: string
          max_score: number | null
          recorded_by: string
          score: number | null
          session_id: string | null
          student_user_id: string
        }
        Insert: {
          activity_type: string
          course_id?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          mastery_status?: string
          max_score?: number | null
          recorded_by: string
          score?: number | null
          session_id?: string | null
          student_user_id: string
        }
        Update: {
          activity_type?: string
          course_id?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          mastery_status?: string
          max_score?: number | null
          recorded_by?: string
          score?: number | null
          session_id?: string | null
          student_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "education_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_progress_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "education_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      education_sessions: {
        Row: {
          course_id: string
          created_at: string
          created_by: string
          ends_at: string
          id: string
          location: string | null
          meeting_url: string | null
          starts_at: string
          status: string
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          created_by: string
          ends_at: string
          id?: string
          location?: string | null
          meeting_url?: string | null
          starts_at: string
          status?: string
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          created_by?: string
          ends_at?: string
          id?: string
          location?: string | null
          meeting_url?: string | null
          starts_at?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "education_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      education_tickets: {
        Row: {
          created_at: string
          enrollment_id: string
          id: string
          payment_id: string
          status: string
          ticket_code: string
          user_id: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          created_at?: string
          enrollment_id: string
          id?: string
          payment_id: string
          status?: string
          ticket_code: string
          user_id: string
          valid_from: string
          valid_until: string
        }
        Update: {
          created_at?: string
          enrollment_id?: string
          id?: string
          payment_id?: string
          status?: string
          ticket_code?: string
          user_id?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_tickets_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "education_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_tickets_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: true
            referencedRelation: "education_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      education_tracks: {
        Row: {
          created_at: string
          label: string
          last_checked_at: string
          levels: string[]
          notes: string | null
          source_url: string | null
          status: string
          track_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          label: string
          last_checked_at?: string
          levels: string[]
          notes?: string | null
          source_url?: string | null
          status?: string
          track_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          label?: string
          last_checked_at?: string
          levels?: string[]
          notes?: string | null
          source_url?: string | null
          status?: string
          track_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_chunks: {
        Row: {
          article_refs: string[]
          chunk_index: number
          content: string
          created_at: string
          id: string
          language: string
          page_refs: string | null
          search_vector: unknown
          source_id: string
          tags: string[]
          topic: string
        }
        Insert: {
          article_refs?: string[]
          chunk_index: number
          content: string
          created_at?: string
          id?: string
          language?: string
          page_refs?: string | null
          search_vector?: unknown
          source_id: string
          tags?: string[]
          topic: string
        }
        Update: {
          article_refs?: string[]
          chunk_index?: number
          content?: string
          created_at?: string
          id?: string
          language?: string
          page_refs?: string | null
          search_vector?: unknown
          source_id?: string
          tags?: string[]
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_chunks_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_sources: {
        Row: {
          applicability: string | null
          caution: string | null
          created_at: string
          id: string
          issuing_authority: string
          official_url: string
          published_on: string | null
          reference_number: string | null
          source_portal: string | null
          source_type: string
          title: string
          updated_at: string
          verification_status: string
        }
        Insert: {
          applicability?: string | null
          caution?: string | null
          created_at?: string
          id: string
          issuing_authority: string
          official_url: string
          published_on?: string | null
          reference_number?: string | null
          source_portal?: string | null
          source_type: string
          title: string
          updated_at?: string
          verification_status?: string
        }
        Update: {
          applicability?: string | null
          caution?: string | null
          created_at?: string
          id?: string
          issuing_authority?: string
          official_url?: string
          published_on?: string | null
          reference_number?: string | null
          source_portal?: string | null
          source_type?: string
          title?: string
          updated_at?: string
          verification_status?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          source_refs: Json
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          source_refs?: Json
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          source_refs?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_owner_fk"
            columns: ["conversation_id", "user_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          preferred_language: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          preferred_language?: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_language?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_education_manager: { Args: never; Returns: boolean }
      is_education_staff: { Args: never; Returns: boolean }
      is_omnia_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
