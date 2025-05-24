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
      aircraft: {
        Row: {
          aircraft_type: string
          created_at: string
          home_base: string | null
          id: string
          manufacturer: string
          max_passengers: number | null
          model: string
          status: Database["public"]["Enums"]["aircraft_status"]
          tail_number: string
          updated_at: string
          year_manufactured: number | null
        }
        Insert: {
          aircraft_type: string
          created_at?: string
          home_base?: string | null
          id?: string
          manufacturer: string
          max_passengers?: number | null
          model: string
          status?: Database["public"]["Enums"]["aircraft_status"]
          tail_number: string
          updated_at?: string
          year_manufactured?: number | null
        }
        Update: {
          aircraft_type?: string
          created_at?: string
          home_base?: string | null
          id?: string
          manufacturer?: string
          max_passengers?: number | null
          model?: string
          status?: Database["public"]["Enums"]["aircraft_status"]
          tail_number?: string
          updated_at?: string
          year_manufactured?: number | null
        }
        Relationships: []
      }
      airports: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          elevation: number | null
          iata_code: string | null
          icao_code: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          elevation?: number | null
          iata_code?: string | null
          icao_code: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          elevation?: number | null
          iata_code?: string | null
          icao_code?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          company_name: string
          contact_person: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name: string
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      crew_members: {
        Row: {
          base_location: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          license_expiry: string | null
          license_number: string | null
          medical_expiry: string | null
          phone: string | null
          position: Database["public"]["Enums"]["crew_position"]
          updated_at: string
        }
        Insert: {
          base_location?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          license_expiry?: string | null
          license_number?: string | null
          medical_expiry?: string | null
          phone?: string | null
          position: Database["public"]["Enums"]["crew_position"]
          updated_at?: string
        }
        Update: {
          base_location?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          license_expiry?: string | null
          license_number?: string | null
          medical_expiry?: string | null
          phone?: string | null
          position?: Database["public"]["Enums"]["crew_position"]
          updated_at?: string
        }
        Relationships: []
      }
      crew_qualifications: {
        Row: {
          aircraft_type: string
          authority: string | null
          certificate_number: string | null
          created_at: string
          crew_member_id: string | null
          expiry_date: string | null
          id: string
          is_active: boolean
          issue_date: string
          qualification_type: string
          updated_at: string
        }
        Insert: {
          aircraft_type: string
          authority?: string | null
          certificate_number?: string | null
          created_at?: string
          crew_member_id?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          issue_date: string
          qualification_type: string
          updated_at?: string
        }
        Update: {
          aircraft_type?: string
          authority?: string | null
          certificate_number?: string | null
          created_at?: string
          crew_member_id?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          issue_date?: string
          qualification_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crew_qualifications_crew_member_id_fkey"
            columns: ["crew_member_id"]
            isOneToOne: false
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          crew_member_id: string | null
          flight_id: string | null
          id: string
          notes: string | null
          position: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          crew_member_id?: string | null
          flight_id?: string | null
          id?: string
          notes?: string | null
          position: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          crew_member_id?: string | null
          flight_id?: string | null
          id?: string
          notes?: string | null
          position?: string
        }
        Relationships: [
          {
            foreignKeyName: "flight_assignments_crew_member_id_fkey"
            columns: ["crew_member_id"]
            isOneToOne: false
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_assignments_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_crew: {
        Row: {
          created_at: string
          crew_member_id: string | null
          flight_id: string | null
          id: string
          position: Database["public"]["Enums"]["crew_position"]
        }
        Insert: {
          created_at?: string
          crew_member_id?: string | null
          flight_id?: string | null
          id?: string
          position: Database["public"]["Enums"]["crew_position"]
        }
        Update: {
          created_at?: string
          crew_member_id?: string | null
          flight_id?: string | null
          id?: string
          position?: Database["public"]["Enums"]["crew_position"]
        }
        Relationships: [
          {
            foreignKeyName: "flight_crew_crew_member_id_fkey"
            columns: ["crew_member_id"]
            isOneToOne: false
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_crew_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_legs: {
        Row: {
          arrival_airport: string
          arrival_time: string
          created_at: string
          departure_airport: string
          departure_time: string
          distance: number | null
          flight_id: string | null
          fuel_required: number | null
          id: string
          leg_number: number
          updated_at: string
        }
        Insert: {
          arrival_airport: string
          arrival_time: string
          created_at?: string
          departure_airport: string
          departure_time: string
          distance?: number | null
          flight_id?: string | null
          fuel_required?: number | null
          id?: string
          leg_number: number
          updated_at?: string
        }
        Update: {
          arrival_airport?: string
          arrival_time?: string
          created_at?: string
          departure_airport?: string
          departure_time?: string
          distance?: number | null
          flight_id?: string | null
          fuel_required?: number | null
          id?: string
          leg_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flight_legs_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_time_limits: {
        Row: {
          created_at: string
          daily_limit: number
          id: string
          min_rest_between_duties: number
          min_weekly_rest: number
          monthly_limit: number
          regulation_name: string
          updated_at: string
          weekly_limit: number
          yearly_limit: number
        }
        Insert: {
          created_at?: string
          daily_limit: number
          id?: string
          min_rest_between_duties: number
          min_weekly_rest: number
          monthly_limit: number
          regulation_name: string
          updated_at?: string
          weekly_limit: number
          yearly_limit: number
        }
        Update: {
          created_at?: string
          daily_limit?: number
          id?: string
          min_rest_between_duties?: number
          min_weekly_rest?: number
          monthly_limit?: number
          regulation_name?: string
          updated_at?: string
          weekly_limit?: number
          yearly_limit?: number
        }
        Relationships: []
      }
      flights: {
        Row: {
          aircraft_id: string | null
          arrival_airport: string
          arrival_time: string
          client_id: string | null
          created_at: string
          departure_airport: string
          departure_time: string
          flight_number: string
          id: string
          notes: string | null
          passenger_count: number | null
          status: Database["public"]["Enums"]["flight_status"]
          updated_at: string
        }
        Insert: {
          aircraft_id?: string | null
          arrival_airport: string
          arrival_time: string
          client_id?: string | null
          created_at?: string
          departure_airport: string
          departure_time: string
          flight_number: string
          id?: string
          notes?: string | null
          passenger_count?: number | null
          status?: Database["public"]["Enums"]["flight_status"]
          updated_at?: string
        }
        Update: {
          aircraft_id?: string | null
          arrival_airport?: string
          arrival_time?: string
          client_id?: string | null
          created_at?: string
          departure_airport?: string
          departure_time?: string
          flight_number?: string
          id?: string
          notes?: string | null
          passenger_count?: number | null
          status?: Database["public"]["Enums"]["flight_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flights_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircraft"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flights_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          aircraft_id: string | null
          completed_date: string | null
          cost: number | null
          created_at: string
          description: string
          id: string
          maintenance_type: string
          notes: string | null
          scheduled_date: string
          status: Database["public"]["Enums"]["maintenance_status"]
          technician_id: string | null
          updated_at: string
        }
        Insert: {
          aircraft_id?: string | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          description: string
          id?: string
          maintenance_type: string
          notes?: string | null
          scheduled_date: string
          status?: Database["public"]["Enums"]["maintenance_status"]
          technician_id?: string | null
          updated_at?: string
        }
        Update: {
          aircraft_id?: string | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          description?: string
          id?: string
          maintenance_type?: string
          notes?: string | null
          scheduled_date?: string
          status?: Database["public"]["Enums"]["maintenance_status"]
          technician_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircraft"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_types: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_mandatory: boolean
          name: string
          required_cycles: number | null
          required_hours: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_mandatory?: boolean
          name: string
          required_cycles?: number | null
          required_hours?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_mandatory?: boolean
          name?: string
          required_cycles?: number | null
          required_hours?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      pilot_flight_hours: {
        Row: {
          created_at: string
          flight_date: string
          flight_hours: number
          flight_id: string | null
          flight_type: string
          id: string
          pilot_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          flight_date: string
          flight_hours: number
          flight_id?: string | null
          flight_type: string
          id?: string
          pilot_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          flight_date?: string
          flight_hours?: number
          flight_id?: string | null
          flight_type?: string
          id?: string
          pilot_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pilot_flight_hours_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pilot_flight_hours_pilot_id_fkey"
            columns: ["pilot_id"]
            isOneToOne: false
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          },
        ]
      }
      pilot_schedule: {
        Row: {
          created_at: string
          end_date: string
          id: string
          notes: string | null
          pilot_id: string
          schedule_type: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          notes?: string | null
          pilot_id: string
          schedule_type: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          notes?: string | null
          pilot_id?: string
          schedule_type?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pilot_schedule_pilot_id_fkey"
            columns: ["pilot_id"]
            isOneToOne: false
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          },
        ]
      }
      published_schedules: {
        Row: {
          created_at: string
          flight_id: string | null
          id: string
          is_commercial: boolean | null
          is_option: boolean | null
          published_at: string
          published_by: string | null
          schedule_version_id: string | null
          trip_type: string | null
        }
        Insert: {
          created_at?: string
          flight_id?: string | null
          id?: string
          is_commercial?: boolean | null
          is_option?: boolean | null
          published_at?: string
          published_by?: string | null
          schedule_version_id?: string | null
          trip_type?: string | null
        }
        Update: {
          created_at?: string
          flight_id?: string | null
          id?: string
          is_commercial?: boolean | null
          is_option?: boolean | null
          published_at?: string
          published_by?: string | null
          schedule_version_id?: string | null
          trip_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "published_schedules_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_schedules_schedule_version_id_fkey"
            columns: ["schedule_version_id"]
            isOneToOne: false
            referencedRelation: "schedule_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          aircraft_type: string | null
          arrival_airport: string
          client_id: string | null
          created_at: string
          departure_airport: string
          departure_date: string
          id: string
          notes: string | null
          passenger_count: number
          quote_number: string
          return_date: string | null
          status: string | null
          total_amount: number | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          aircraft_type?: string | null
          arrival_airport: string
          client_id?: string | null
          created_at?: string
          departure_airport: string
          departure_date: string
          id?: string
          notes?: string | null
          passenger_count: number
          quote_number: string
          return_date?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          aircraft_type?: string | null
          arrival_airport?: string
          client_id?: string | null
          created_at?: string
          departure_airport?: string
          departure_date?: string
          id?: string
          notes?: string | null
          passenger_count?: number
          quote_number?: string
          return_date?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_changes: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          change_type: string
          changed_at: string
          changed_by: string | null
          flight_id: string | null
          id: string
          new_value: Json | null
          old_value: Json | null
          reason: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          change_type: string
          changed_at?: string
          changed_by?: string | null
          flight_id?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          reason?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          change_type?: string
          changed_at?: string
          changed_by?: string | null
          flight_id?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_changes_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_versions: {
        Row: {
          client_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          version_number: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          version_number?: number
        }
        Update: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedule_versions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      aircraft_status: "available" | "maintenance" | "aog" | "retired"
      crew_position: "captain" | "first_officer" | "cabin_crew" | "mechanic"
      flight_status:
        | "scheduled"
        | "active"
        | "completed"
        | "cancelled"
        | "delayed"
      maintenance_status: "scheduled" | "in_progress" | "completed" | "overdue"
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
      aircraft_status: ["available", "maintenance", "aog", "retired"],
      crew_position: ["captain", "first_officer", "cabin_crew", "mechanic"],
      flight_status: [
        "scheduled",
        "active",
        "completed",
        "cancelled",
        "delayed",
      ],
      maintenance_status: ["scheduled", "in_progress", "completed", "overdue"],
    },
  },
} as const
