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
      aircraft_documents: {
        Row: {
          aircraft_id: string | null
          created_at: string | null
          document_name: string
          document_number: string | null
          document_type: string
          expiry_date: string | null
          file_path: string | null
          id: string
          is_required_for_dispatch: boolean | null
          issue_date: string | null
          issuing_authority: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          aircraft_id?: string | null
          created_at?: string | null
          document_name: string
          document_number?: string | null
          document_type: string
          expiry_date?: string | null
          file_path?: string | null
          id?: string
          is_required_for_dispatch?: boolean | null
          issue_date?: string | null
          issuing_authority?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          aircraft_id?: string | null
          created_at?: string | null
          document_name?: string
          document_number?: string | null
          document_type?: string
          expiry_date?: string | null
          file_path?: string | null
          id?: string
          is_required_for_dispatch?: boolean | null
          issue_date?: string | null
          issuing_authority?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aircraft_documents_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircraft"
            referencedColumns: ["id"]
          },
        ]
      }
      aircraft_fees: {
        Row: {
          aircraft_type: string
          amount: number
          calculation_method: string | null
          created_at: string
          currency: string
          fee_name: string
          fee_type: string
          id: string
          notes: string | null
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          aircraft_type: string
          amount: number
          calculation_method?: string | null
          created_at?: string
          currency?: string
          fee_name: string
          fee_type: string
          id?: string
          notes?: string | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          aircraft_type?: string
          amount?: number
          calculation_method?: string | null
          created_at?: string
          currency?: string
          fee_name?: string
          fee_type?: string
          id?: string
          notes?: string | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      aircraft_hold_items: {
        Row: {
          aircraft_id: string | null
          applied_by: string | null
          ata_chapter: string | null
          created_at: string | null
          date_applied: string | null
          id: string
          item_description: string
          item_reference: string
          limitation_description: string | null
          mel_reference: string | null
          resolution_date: string | null
          resolution_description: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          aircraft_id?: string | null
          applied_by?: string | null
          ata_chapter?: string | null
          created_at?: string | null
          date_applied?: string | null
          id?: string
          item_description: string
          item_reference: string
          limitation_description?: string | null
          mel_reference?: string | null
          resolution_date?: string | null
          resolution_description?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          aircraft_id?: string | null
          applied_by?: string | null
          ata_chapter?: string | null
          created_at?: string | null
          date_applied?: string | null
          id?: string
          item_description?: string
          item_reference?: string
          limitation_description?: string | null
          mel_reference?: string | null
          resolution_date?: string | null
          resolution_description?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aircraft_hold_items_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircraft"
            referencedColumns: ["id"]
          },
        ]
      }
      aircraft_maintenance_limits: {
        Row: {
          aircraft_id: string | null
          calendar_limit_date: string | null
          created_at: string | null
          flight_cycles_limit: number | null
          flight_hours_limit: number | null
          id: string
          inspection_type: string | null
          next_inspection_cycles: number | null
          next_inspection_date: string | null
          next_inspection_hours: number | null
          updated_at: string | null
          warning_threshold_days: number | null
        }
        Insert: {
          aircraft_id?: string | null
          calendar_limit_date?: string | null
          created_at?: string | null
          flight_cycles_limit?: number | null
          flight_hours_limit?: number | null
          id?: string
          inspection_type?: string | null
          next_inspection_cycles?: number | null
          next_inspection_date?: string | null
          next_inspection_hours?: number | null
          updated_at?: string | null
          warning_threshold_days?: number | null
        }
        Update: {
          aircraft_id?: string | null
          calendar_limit_date?: string | null
          created_at?: string | null
          flight_cycles_limit?: number | null
          flight_hours_limit?: number | null
          id?: string
          inspection_type?: string | null
          next_inspection_cycles?: number | null
          next_inspection_date?: string | null
          next_inspection_hours?: number | null
          updated_at?: string | null
          warning_threshold_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "aircraft_maintenance_limits_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircraft"
            referencedColumns: ["id"]
          },
        ]
      }
      aircraft_technical_data: {
        Row: {
          aircraft_id: string | null
          airframe_tac: number | null
          airframe_tah_hours: number | null
          airframe_tah_minutes: number | null
          apu_serial_number: string | null
          apu_start_date: string | null
          apu_tac: number | null
          apu_tah_hours: number | null
          apu_tah_minutes: number | null
          created_at: string | null
          engine_1_serial_number: string | null
          engine_1_start_date: string | null
          engine_1_tac: number | null
          engine_1_tah_hours: number | null
          engine_1_tah_minutes: number | null
          engine_2_serial_number: string | null
          engine_2_start_date: string | null
          engine_2_tac: number | null
          engine_2_tah_hours: number | null
          engine_2_tah_minutes: number | null
          id: string
          last_updated: string | null
          updated_by: string | null
        }
        Insert: {
          aircraft_id?: string | null
          airframe_tac?: number | null
          airframe_tah_hours?: number | null
          airframe_tah_minutes?: number | null
          apu_serial_number?: string | null
          apu_start_date?: string | null
          apu_tac?: number | null
          apu_tah_hours?: number | null
          apu_tah_minutes?: number | null
          created_at?: string | null
          engine_1_serial_number?: string | null
          engine_1_start_date?: string | null
          engine_1_tac?: number | null
          engine_1_tah_hours?: number | null
          engine_1_tah_minutes?: number | null
          engine_2_serial_number?: string | null
          engine_2_start_date?: string | null
          engine_2_tac?: number | null
          engine_2_tah_hours?: number | null
          engine_2_tah_minutes?: number | null
          id?: string
          last_updated?: string | null
          updated_by?: string | null
        }
        Update: {
          aircraft_id?: string | null
          airframe_tac?: number | null
          airframe_tah_hours?: number | null
          airframe_tah_minutes?: number | null
          apu_serial_number?: string | null
          apu_start_date?: string | null
          apu_tac?: number | null
          apu_tah_hours?: number | null
          apu_tah_minutes?: number | null
          created_at?: string | null
          engine_1_serial_number?: string | null
          engine_1_start_date?: string | null
          engine_1_tac?: number | null
          engine_1_tah_hours?: number | null
          engine_1_tah_minutes?: number | null
          engine_2_serial_number?: string | null
          engine_2_start_date?: string | null
          engine_2_tac?: number | null
          engine_2_tah_hours?: number | null
          engine_2_tah_minutes?: number | null
          id?: string
          last_updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aircraft_technical_data_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircraft"
            referencedColumns: ["id"]
          },
        ]
      }
      airport_directory: {
        Row: {
          airport_code: string
          airport_name: string
          available_services: Json | null
          catering_suppliers: Json | null
          contact_info: Json | null
          created_at: string
          customs_hours: Json | null
          fuel_suppliers: Json | null
          handling_companies: Json | null
          id: string
          immigration_hours: Json | null
          last_updated: string
          notes: string | null
          opening_hours: Json | null
        }
        Insert: {
          airport_code: string
          airport_name: string
          available_services?: Json | null
          catering_suppliers?: Json | null
          contact_info?: Json | null
          created_at?: string
          customs_hours?: Json | null
          fuel_suppliers?: Json | null
          handling_companies?: Json | null
          id?: string
          immigration_hours?: Json | null
          last_updated?: string
          notes?: string | null
          opening_hours?: Json | null
        }
        Update: {
          airport_code?: string
          airport_name?: string
          available_services?: Json | null
          catering_suppliers?: Json | null
          contact_info?: Json | null
          created_at?: string
          customs_hours?: Json | null
          fuel_suppliers?: Json | null
          handling_companies?: Json | null
          id?: string
          immigration_hours?: Json | null
          last_updated?: string
          notes?: string | null
          opening_hours?: Json | null
        }
        Relationships: []
      }
      airport_fees: {
        Row: {
          aircraft_category: string | null
          airport_code: string
          amount: number
          created_at: string
          currency: string
          fee_name: string
          fee_type: string
          id: string
          notes: string | null
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          aircraft_category?: string | null
          airport_code: string
          amount: number
          created_at?: string
          currency?: string
          fee_name: string
          fee_type: string
          id?: string
          notes?: string | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          aircraft_category?: string | null
          airport_code?: string
          amount?: number
          created_at?: string
          currency?: string
          fee_name?: string
          fee_type?: string
          id?: string
          notes?: string | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
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
      checklist_email_templates: {
        Row: {
          auto_send: boolean
          checklist_item_id: string | null
          created_at: string
          email_template_id: string | null
          id: string
          trigger_condition: string | null
        }
        Insert: {
          auto_send?: boolean
          checklist_item_id?: string | null
          created_at?: string
          email_template_id?: string | null
          id?: string
          trigger_condition?: string | null
        }
        Update: {
          auto_send?: boolean
          checklist_item_id?: string | null
          created_at?: string
          email_template_id?: string | null
          id?: string
          trigger_condition?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_email_templates_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "ops_checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_email_templates_email_template_id_fkey"
            columns: ["email_template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          checklist_id: string | null
          created_at: string
          id: string
          is_required: boolean
          item_text: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          checklist_id?: string | null
          created_at?: string
          id?: string
          is_required?: boolean
          item_text: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          checklist_id?: string | null
          created_at?: string
          id?: string
          is_required?: boolean
          item_text?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "sales_checklists"
            referencedColumns: ["id"]
          },
        ]
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
      crew_flight_assignments: {
        Row: {
          airport_recency_valid: boolean | null
          assigned_at: string
          assigned_by: string | null
          certificates_valid: boolean | null
          crew_member_id: string | null
          currency_valid: boolean | null
          duty_end_time: string | null
          duty_start_time: string | null
          duty_time_hours: number | null
          flight_id: string | null
          flight_time_hours: number | null
          ftl_compliant: boolean | null
          ftl_notes: string | null
          id: string
          notes: string | null
          passport_valid: boolean | null
          position: string
          reporting_time: string | null
          rest_time_hours: number | null
          visa_valid: boolean | null
        }
        Insert: {
          airport_recency_valid?: boolean | null
          assigned_at?: string
          assigned_by?: string | null
          certificates_valid?: boolean | null
          crew_member_id?: string | null
          currency_valid?: boolean | null
          duty_end_time?: string | null
          duty_start_time?: string | null
          duty_time_hours?: number | null
          flight_id?: string | null
          flight_time_hours?: number | null
          ftl_compliant?: boolean | null
          ftl_notes?: string | null
          id?: string
          notes?: string | null
          passport_valid?: boolean | null
          position: string
          reporting_time?: string | null
          rest_time_hours?: number | null
          visa_valid?: boolean | null
        }
        Update: {
          airport_recency_valid?: boolean | null
          assigned_at?: string
          assigned_by?: string | null
          certificates_valid?: boolean | null
          crew_member_id?: string | null
          currency_valid?: boolean | null
          duty_end_time?: string | null
          duty_start_time?: string | null
          duty_time_hours?: number | null
          flight_id?: string | null
          flight_time_hours?: number | null
          ftl_compliant?: boolean | null
          ftl_notes?: string | null
          id?: string
          notes?: string | null
          passport_valid?: boolean | null
          position?: string
          reporting_time?: string | null
          rest_time_hours?: number | null
          visa_valid?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "crew_flight_assignments_crew_member_id_fkey"
            columns: ["crew_member_id"]
            isOneToOne: false
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_flight_assignments_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
        ]
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
      document_links: {
        Row: {
          created_at: string
          created_by: string | null
          document_id: string | null
          document_type: string
          entity_id: string
          entity_type: string
          id: string
          link_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          document_type: string
          entity_id: string
          entity_type: string
          id?: string
          link_type?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          document_type?: string
          entity_id?: string
          entity_type?: string
          id?: string
          link_type?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          subject: string
          template_type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          subject: string
          template_type?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: []
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
      flight_changes_log: {
        Row: {
          change_reason: string | null
          change_type: string
          changed_at: string
          changed_by: string
          color_code: string | null
          field_changed: string
          flight_id: string | null
          id: string
          new_value: string | null
          old_value: string | null
          requires_attention: boolean
        }
        Insert: {
          change_reason?: string | null
          change_type: string
          changed_at?: string
          changed_by: string
          color_code?: string | null
          field_changed: string
          flight_id?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          requires_attention?: boolean
        }
        Update: {
          change_reason?: string | null
          change_type?: string
          changed_at?: string
          changed_by?: string
          color_code?: string | null
          field_changed?: string
          flight_id?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          requires_attention?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "flight_changes_log_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_checklist_progress: {
        Row: {
          checklist_item_id: string | null
          color_code: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          flight_id: string | null
          id: string
          is_completed: boolean
          notes: string | null
          status: string
        }
        Insert: {
          checklist_item_id?: string | null
          color_code?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          flight_id?: string | null
          id?: string
          is_completed?: boolean
          notes?: string | null
          status?: string
        }
        Update: {
          checklist_item_id?: string | null
          color_code?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          flight_id?: string | null
          id?: string
          is_completed?: boolean
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "flight_checklist_progress_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "ops_checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_checklist_progress_flight_id_fkey"
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
      flight_documents: {
        Row: {
          created_at: string
          document_name: string
          document_type: string
          file_path: string | null
          flight_id: string | null
          generated_at: string | null
          generated_by: string | null
          generated_content: string | null
          id: string
          is_active: boolean
          is_generated: boolean
          template_content: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_name: string
          document_type: string
          file_path?: string | null
          flight_id?: string | null
          generated_at?: string | null
          generated_by?: string | null
          generated_content?: string | null
          id?: string
          is_active?: boolean
          is_generated?: boolean
          template_content?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_name?: string
          document_type?: string
          file_path?: string | null
          flight_id?: string | null
          generated_at?: string | null
          generated_by?: string | null
          generated_content?: string | null
          id?: string
          is_active?: boolean
          is_generated?: boolean
          template_content?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flight_documents_flight_id_fkey"
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
      flight_passengers: {
        Row: {
          created_at: string
          flight_id: string | null
          id: string
          is_vip: boolean
          passenger_id: string | null
          seat_number: string | null
          special_requests: string | null
        }
        Insert: {
          created_at?: string
          flight_id?: string | null
          id?: string
          is_vip?: boolean
          passenger_id?: string | null
          seat_number?: string | null
          special_requests?: string | null
        }
        Update: {
          created_at?: string
          flight_id?: string | null
          id?: string
          is_vip?: boolean
          passenger_id?: string | null
          seat_number?: string | null
          special_requests?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flight_passengers_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_passengers_passenger_id_fkey"
            columns: ["passenger_id"]
            isOneToOne: false
            referencedRelation: "passengers"
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
      handling_requests: {
        Row: {
          airport_code: string
          created_at: string
          flight_id: string | null
          id: string
          notes: string | null
          request_details: string
          requested_at: string
          requested_by: string | null
          response_received_at: string | null
          service_type: string
          status: string
        }
        Insert: {
          airport_code: string
          created_at?: string
          flight_id?: string | null
          id?: string
          notes?: string | null
          request_details: string
          requested_at?: string
          requested_by?: string | null
          response_received_at?: string | null
          service_type: string
          status?: string
        }
        Update: {
          airport_code?: string
          created_at?: string
          flight_id?: string | null
          id?: string
          notes?: string | null
          request_details?: string
          requested_at?: string
          requested_by?: string | null
          response_received_at?: string | null
          service_type?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "handling_requests_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
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
      messages: {
        Row: {
          avinode_reference: string | null
          content: string
          created_at: string
          id: string
          is_internal: boolean
          message_type: string
          quote_id: string | null
          recipient_email: string | null
          recipient_name: string | null
          sender_email: string | null
          sender_name: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          avinode_reference?: string | null
          content: string
          created_at?: string
          id?: string
          is_internal?: boolean
          message_type?: string
          quote_id?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          sender_email?: string | null
          sender_name: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          avinode_reference?: string | null
          content?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          message_type?: string
          quote_id?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          sender_email?: string | null
          sender_name?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      oil_consumption_records: {
        Row: {
          aircraft_id: string | null
          consumption_rate: number | null
          created_at: string | null
          engine_position: string
          flight_date: string
          flight_hours: number | null
          id: string
          notes: string | null
          oil_added_liters: number | null
          oil_level_after: number | null
          oil_level_before: number | null
          recorded_by: string | null
        }
        Insert: {
          aircraft_id?: string | null
          consumption_rate?: number | null
          created_at?: string | null
          engine_position: string
          flight_date: string
          flight_hours?: number | null
          id?: string
          notes?: string | null
          oil_added_liters?: number | null
          oil_level_after?: number | null
          oil_level_before?: number | null
          recorded_by?: string | null
        }
        Update: {
          aircraft_id?: string | null
          consumption_rate?: number | null
          created_at?: string | null
          engine_position?: string
          flight_date?: string
          flight_hours?: number | null
          id?: string
          notes?: string | null
          oil_added_liters?: number | null
          oil_level_after?: number | null
          oil_level_before?: number | null
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oil_consumption_records_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircraft"
            referencedColumns: ["id"]
          },
        ]
      }
      ops_checklist_items: {
        Row: {
          attach_to: string
          auto_add_to_log: boolean
          checklist_id: string | null
          checklist_section: string
          cql_condition: string | null
          created_at: string
          due_dates: string | null
          email_template_id: string | null
          id: string
          is_required: boolean
          item_text: string
          sales_ops: string
          sort_order: number
          updated_at: string
          visible_on_crew_app: boolean
        }
        Insert: {
          attach_to?: string
          auto_add_to_log?: boolean
          checklist_id?: string | null
          checklist_section?: string
          cql_condition?: string | null
          created_at?: string
          due_dates?: string | null
          email_template_id?: string | null
          id?: string
          is_required?: boolean
          item_text: string
          sales_ops?: string
          sort_order?: number
          updated_at?: string
          visible_on_crew_app?: boolean
        }
        Update: {
          attach_to?: string
          auto_add_to_log?: boolean
          checklist_id?: string | null
          checklist_section?: string
          cql_condition?: string | null
          created_at?: string
          due_dates?: string | null
          email_template_id?: string | null
          id?: string
          is_required?: boolean
          item_text?: string
          sales_ops?: string
          sort_order?: number
          updated_at?: string
          visible_on_crew_app?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "ops_checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "sales_checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ops_checklist_items_email_template_id_fkey"
            columns: ["email_template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      passengers: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          nationality: string | null
          passport_expiry: string | null
          passport_number: string | null
          phone: string | null
          special_requirements: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          nationality?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          phone?: string | null
          special_requirements?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          nationality?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          phone?: string | null
          special_requirements?: string | null
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
      quote_checklist_progress: {
        Row: {
          checklist_item_id: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: string
          is_completed: boolean
          notes: string | null
          quote_id: string | null
        }
        Insert: {
          checklist_item_id?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          notes?: string | null
          quote_id?: string | null
        }
        Update: {
          checklist_item_id?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          notes?: string | null
          quote_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_checklist_progress_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_checklist_progress_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_flight_links: {
        Row: {
          created_at: string
          flight_id: string | null
          id: string
          linked_at: string
          linked_by: string | null
          notes: string | null
          quote_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          flight_id?: string | null
          id?: string
          linked_at?: string
          linked_by?: string | null
          notes?: string | null
          quote_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          flight_id?: string | null
          id?: string
          linked_at?: string
          linked_by?: string | null
          notes?: string | null
          quote_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_flight_links_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_flight_links_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          aircraft_type: string | null
          arrival_airport: string
          base_cost: number | null
          client_id: string | null
          created_at: string
          crew_cost: number | null
          departure_airport: string
          departure_date: string
          fuel_cost: number | null
          handling_cost: number | null
          id: string
          margin_percentage: number | null
          marketplace_source: string | null
          notes: string | null
          other_costs: number | null
          passenger_count: number
          pricing_method: string | null
          quote_number: string
          return_date: string | null
          status: string | null
          total_amount: number | null
          updated_at: string
          valid_until: string | null
          vat_amount: number | null
          vat_rate: number | null
        }
        Insert: {
          aircraft_type?: string | null
          arrival_airport: string
          base_cost?: number | null
          client_id?: string | null
          created_at?: string
          crew_cost?: number | null
          departure_airport: string
          departure_date: string
          fuel_cost?: number | null
          handling_cost?: number | null
          id?: string
          margin_percentage?: number | null
          marketplace_source?: string | null
          notes?: string | null
          other_costs?: number | null
          passenger_count: number
          pricing_method?: string | null
          quote_number: string
          return_date?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string
          valid_until?: string | null
          vat_amount?: number | null
          vat_rate?: number | null
        }
        Update: {
          aircraft_type?: string | null
          arrival_airport?: string
          base_cost?: number | null
          client_id?: string | null
          created_at?: string
          crew_cost?: number | null
          departure_airport?: string
          departure_date?: string
          fuel_cost?: number | null
          handling_cost?: number | null
          id?: string
          margin_percentage?: number | null
          marketplace_source?: string | null
          notes?: string | null
          other_costs?: number | null
          passenger_count?: number
          pricing_method?: string | null
          quote_number?: string
          return_date?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string
          valid_until?: string | null
          vat_amount?: number | null
          vat_rate?: number | null
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
      sales_checklists: {
        Row: {
          checklist_type: string
          created_at: string
          description: string | null
          id: string
          is_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          checklist_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          checklist_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales_documents: {
        Row: {
          created_at: string
          document_type: string
          id: string
          is_active: boolean
          name: string
          template_content: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_type?: string
          id?: string
          is_active?: boolean
          name: string
          template_content: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_type?: string
          id?: string
          is_active?: boolean
          name?: string
          template_content?: string
          updated_at?: string
        }
        Relationships: []
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
      schedule_exports: {
        Row: {
          created_at: string
          date_range_end: string
          date_range_start: string
          export_format: string
          export_name: string
          exported_by: string
          file_path: string | null
          filters: Json | null
          id: string
        }
        Insert: {
          created_at?: string
          date_range_end: string
          date_range_start: string
          export_format: string
          export_name: string
          exported_by: string
          file_path?: string | null
          filters?: Json | null
          id?: string
        }
        Update: {
          created_at?: string
          date_range_end?: string
          date_range_start?: string
          export_format?: string
          export_name?: string
          exported_by?: string
          file_path?: string | null
          filters?: Json | null
          id?: string
        }
        Relationships: []
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
      sync_status: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          error_details: string | null
          id: string
          last_sync_at: string | null
          source_module: string
          sync_data: Json | null
          sync_status: string
          target_module: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          error_details?: string | null
          id?: string
          last_sync_at?: string | null
          source_module: string
          sync_data?: Json | null
          sync_status?: string
          target_module: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          error_details?: string | null
          id?: string
          last_sync_at?: string | null
          source_module?: string
          sync_data?: Json | null
          sync_status?: string
          target_module?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_notifications: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          module_source: string
          module_target: string
          notification_type: string
          priority: string
          read_at: string | null
          title: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          module_source: string
          module_target: string
          notification_type: string
          priority?: string
          read_at?: string | null
          title: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          module_source?: string
          module_target?: string
          notification_type?: string
          priority?: string
          read_at?: string | null
          title?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          module: string
          permission_type: string
          resource_id: string | null
          user_email: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          module: string
          permission_type: string
          resource_id?: string | null
          user_email: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          module?: string
          permission_type?: string
          resource_id?: string | null
          user_email?: string
        }
        Relationships: []
      }
      vat_rates: {
        Row: {
          country_code: string
          country_name: string
          created_at: string
          id: string
          is_default: boolean
          updated_at: string
          vat_rate: number
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string
          id?: string
          is_default?: boolean
          updated_at?: string
          vat_rate?: number
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string
          id?: string
          is_default?: boolean
          updated_at?: string
          vat_rate?: number
        }
        Relationships: []
      }
      workflow_executions: {
        Row: {
          completed_at: string | null
          entity_id: string
          entity_type: string
          error_message: string | null
          executed_at: string
          id: string
          result: Json | null
          status: string
          workflow_rule_id: string | null
        }
        Insert: {
          completed_at?: string | null
          entity_id: string
          entity_type: string
          error_message?: string | null
          executed_at?: string
          id?: string
          result?: Json | null
          status?: string
          workflow_rule_id?: string | null
        }
        Update: {
          completed_at?: string | null
          entity_id?: string
          entity_type?: string
          error_message?: string | null
          executed_at?: string
          id?: string
          result?: Json | null
          status?: string
          workflow_rule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_workflow_rule_id_fkey"
            columns: ["workflow_rule_id"]
            isOneToOne: false
            referencedRelation: "workflow_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_rules: {
        Row: {
          conditions: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          parameters: Json | null
          target_action: string
          target_module: string
          trigger_event: string
          trigger_module: string
          updated_at: string
        }
        Insert: {
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          parameters?: Json | null
          target_action: string
          target_module: string
          trigger_event: string
          trigger_module: string
          updated_at?: string
        }
        Update: {
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parameters?: Json | null
          target_action?: string
          target_module?: string
          trigger_event?: string
          trigger_module?: string
          updated_at?: string
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
