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
      ai_audit_logs: {
        Row: {
          action_type: string
          ai_model: string
          created_at: string
          id: string
          input_summary: string | null
          output_summary: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          ai_model: string
          created_at?: string
          id?: string
          input_summary?: string | null
          output_summary?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          ai_model?: string
          created_at?: string
          id?: string
          input_summary?: string | null
          output_summary?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      court_session_participants: {
        Row: {
          id: string
          oath_taken: boolean | null
          oath_timestamp: string | null
          role: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          oath_taken?: boolean | null
          oath_timestamp?: string | null
          role: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          oath_taken?: boolean | null
          oath_timestamp?: string | null
          role?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "court_session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "court_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      court_sessions: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          created_by: string | null
          description: string | null
          flame_integrity_score: number | null
          id: string
          is_encrypted: boolean | null
          prayer_completed: boolean | null
          scheduled_end: string
          scheduled_start: string
          status: string
          title: string
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          created_by?: string | null
          description?: string | null
          flame_integrity_score?: number | null
          id?: string
          is_encrypted?: boolean | null
          prayer_completed?: boolean | null
          scheduled_end: string
          scheduled_start: string
          status: string
          title: string
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          created_by?: string | null
          description?: string | null
          flame_integrity_score?: number | null
          id?: string
          is_encrypted?: boolean | null
          prayer_completed?: boolean | null
          scheduled_end?: string
          scheduled_start?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      emergency_alerts: {
        Row: {
          id: string
          message: string
          resolution_notes: string | null
          resolved: boolean | null
          session_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          message: string
          resolution_notes?: string | null
          resolved?: boolean | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          message?: string
          resolution_notes?: string | null
          resolved?: boolean | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_alerts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "court_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category: Database["public"]["Enums"]["post_category"]
          comments_count: number | null
          content: string
          created_at: string | null
          id: string
          likes: number | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["post_category"]
          comments_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          likes?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["post_category"]
          comments_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      precedents: {
        Row: {
          confidence: number | null
          created_at: string | null
          date: string | null
          full_text: string | null
          id: string
          jurisdiction: string | null
          principle: string | null
          scroll_gate: string | null
          scroll_phase: string | null
          summary: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          date?: string | null
          full_text?: string | null
          id?: string
          jurisdiction?: string | null
          principle?: string | null
          scroll_gate?: string | null
          scroll_phase?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          date?: string | null
          full_text?: string | null
          id?: string
          jurisdiction?: string | null
          principle?: string | null
          scroll_gate?: string | null
          scroll_phase?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      scroll_evidence: {
        Row: {
          description: string | null
          file_path: string
          file_type: string | null
          id: string
          is_sealed: boolean | null
          petition_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          description?: string | null
          file_path: string
          file_type?: string | null
          id?: string
          is_sealed?: boolean | null
          petition_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          description?: string | null
          file_path?: string
          file_type?: string | null
          id?: string
          is_sealed?: boolean | null
          petition_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "scroll_evidence_petition_id_fkey"
            columns: ["petition_id"]
            isOneToOne: false
            referencedRelation: "scroll_petitions"
            referencedColumns: ["id"]
          },
        ]
      }
      scroll_integrity_logs: {
        Row: {
          action_type: string
          created_at: string
          description: string | null
          id: string
          integrity_impact: number
          petition_id: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          description?: string | null
          id?: string
          integrity_impact: number
          petition_id?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          description?: string | null
          id?: string
          integrity_impact?: number
          petition_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      scroll_petitions: {
        Row: {
          ai_suggested_verdict: string | null
          assigned_judge_id: string | null
          created_at: string
          description: string
          id: string
          is_sealed: boolean
          petitioner_id: string
          scroll_integrity_score: number | null
          status: string | null
          title: string
          updated_at: string
          verdict: string | null
          verdict_reasoning: string | null
          verdict_timestamp: string | null
        }
        Insert: {
          ai_suggested_verdict?: string | null
          assigned_judge_id?: string | null
          created_at?: string
          description: string
          id?: string
          is_sealed?: boolean
          petitioner_id: string
          scroll_integrity_score?: number | null
          status?: string | null
          title: string
          updated_at?: string
          verdict?: string | null
          verdict_reasoning?: string | null
          verdict_timestamp?: string | null
        }
        Update: {
          ai_suggested_verdict?: string | null
          assigned_judge_id?: string | null
          created_at?: string
          description?: string
          id?: string
          is_sealed?: boolean
          petitioner_id?: string
          scroll_integrity_score?: number | null
          status?: string | null
          title?: string
          updated_at?: string
          verdict?: string | null
          verdict_reasoning?: string | null
          verdict_timestamp?: string | null
        }
        Relationships: []
      }
      scroll_witness_logs: {
        Row: {
          action: string
          details: string | null
          id: string
          session_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          details?: string | null
          id?: string
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          details?: string | null
          id?: string
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scroll_witness_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "court_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_feedback: {
        Row: {
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          rating: number
          session_id: string
          testimony: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          rating: number
          session_id: string
          testimony: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          rating?: number
          session_id?: string
          testimony?: string
          user_id?: string | null
        }
        Relationships: []
      }
      session_recordings: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          encrypted: boolean | null
          encryption_key: string | null
          file_url: string
          id: string
          session_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          encrypted?: boolean | null
          encryption_key?: string | null
          file_url: string
          id?: string
          session_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          encrypted?: boolean | null
          encryption_key?: string | null
          file_url?: string
          id?: string
          session_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_recordings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "court_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          stripe_customer_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          customer_id: string | null
          id: string
          price_id: string | null
          status: string
          tier: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          customer_id?: string | null
          id?: string
          price_id?: string | null
          status?: string
          tier?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          customer_id?: string | null
          id?: string
          price_id?: string | null
          status?: string
          tier?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          community_sent: boolean | null
          community_sent_at: string | null
          created_at: string | null
          id: string
          next_email_date: string | null
          next_email_type: string | null
          opted_out: boolean | null
          opted_out_at: string | null
          petition_sent: boolean | null
          petition_sent_at: string | null
          preferences: Json | null
          privacy_sent: boolean | null
          privacy_sent_at: string | null
          sequence_position: number | null
          subscription_sent: boolean | null
          subscription_sent_at: string | null
          updated_at: string | null
          user_email: string
          user_id: string | null
          welcome_sent: boolean | null
          welcome_sent_at: string | null
        }
        Insert: {
          community_sent?: boolean | null
          community_sent_at?: string | null
          created_at?: string | null
          id?: string
          next_email_date?: string | null
          next_email_type?: string | null
          opted_out?: boolean | null
          opted_out_at?: string | null
          petition_sent?: boolean | null
          petition_sent_at?: string | null
          preferences?: Json | null
          privacy_sent?: boolean | null
          privacy_sent_at?: string | null
          sequence_position?: number | null
          subscription_sent?: boolean | null
          subscription_sent_at?: string | null
          updated_at?: string | null
          user_email: string
          user_id?: string | null
          welcome_sent?: boolean | null
          welcome_sent_at?: string | null
        }
        Update: {
          community_sent?: boolean | null
          community_sent_at?: string | null
          created_at?: string | null
          id?: string
          next_email_date?: string | null
          next_email_type?: string | null
          opted_out?: boolean | null
          opted_out_at?: string | null
          petition_sent?: boolean | null
          petition_sent_at?: string | null
          preferences?: Json | null
          privacy_sent?: boolean | null
          privacy_sent_at?: string | null
          sequence_position?: number | null
          subscription_sent?: boolean | null
          subscription_sent_at?: string | null
          updated_at?: string | null
          user_email?: string
          user_id?: string | null
          welcome_sent?: boolean | null
          welcome_sent_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          last_role_change: string | null
          reputation_score: number
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_role_change?: string | null
          reputation_score?: number
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_role_change?: string | null
          reputation_score?: number
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      witness_summons: {
        Row: {
          expires_at: string
          id: string
          invited_at: string | null
          invited_by: string | null
          invited_email: string
          role: string
          session_id: string | null
          status: string | null
          token: string
        }
        Insert: {
          expires_at: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          invited_email: string
          role: string
          session_id?: string | null
          status?: string | null
          token: string
        }
        Update: {
          expires_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          invited_email?: string
          role?: string
          session_id?: string | null
          status?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "witness_summons_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "court_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      create_ai_audit_logs_table: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      post_category:
        | "testimony"
        | "prayer_request"
        | "legal_question"
        | "righteous_insight"
        | "announcement"
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
    Enums: {
      post_category: [
        "testimony",
        "prayer_request",
        "legal_question",
        "righteous_insight",
        "announcement",
      ],
    },
  },
} as const
