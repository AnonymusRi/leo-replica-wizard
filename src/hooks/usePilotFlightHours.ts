
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PilotFlightHour {
  id: string;
  pilot_id: string;
  flight_id?: string;
  flight_date: string;
  flight_hours: number;
  flight_type: string;
  created_at: string;
  updated_at: string;
}

export interface PilotSchedule {
  id: string;
  pilot_id: string;
  start_date: string;
  end_date: string;
  schedule_type: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FlightTimeLimit {
  id: string;
  regulation_name: string;
  daily_limit: number;
  weekly_limit: number;
  monthly_limit: number;
  yearly_limit: number;
  min_rest_between_duties: number;
  min_weekly_rest: number;
  created_at: string;
  updated_at: string;
}

export const usePilotFlightHours = (pilotId?: string) => {
  return useQuery({
    queryKey: ['pilot_flight_hours', pilotId],
    queryFn: async () => {
      // Temporary implementation using raw query until tables are created
      let query = `SELECT * FROM pilot_flight_hours`;
      const params: any[] = [];
      
      if (pilotId) {
        query += ` WHERE pilot_id = $1`;
        params.push(pilotId);
      }
      
      query += ` ORDER BY flight_date DESC`;
      
      try {
        const { data, error } = await supabase.rpc('execute_sql', { 
          query, 
          params 
        });
        
        if (error) {
          console.log('Tables not yet created, returning empty array');
          return [];
        }
        
        return data as PilotFlightHour[];
      } catch (error) {
        console.log('Tables not yet created, returning empty array');
        return [];
      }
    }
  });
};

export const usePilotSchedule = (pilotId?: string) => {
  return useQuery({
    queryKey: ['pilot_schedule', pilotId],
    queryFn: async () => {
      try {
        let query = `SELECT * FROM pilot_schedule`;
        const params: any[] = [];
        
        if (pilotId) {
          query += ` WHERE pilot_id = $1`;
          params.push(pilotId);
        }
        
        query += ` ORDER BY start_date ASC`;
        
        const { data, error } = await supabase.rpc('execute_sql', { 
          query, 
          params 
        });
        
        if (error) {
          console.log('Tables not yet created, returning empty array');
          return [];
        }
        
        return data as PilotSchedule[];
      } catch (error) {
        console.log('Tables not yet created, returning empty array');
        return [];
      }
    }
  });
};

export const useFlightTimeLimits = () => {
  return useQuery({
    queryKey: ['flight_time_limits'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('execute_sql', { 
          query: 'SELECT * FROM flight_time_limits ORDER BY regulation_name',
          params: []
        });
        
        if (error) {
          console.log('Tables not yet created, returning empty array');
          return [];
        }
        
        return data as FlightTimeLimit[];
      } catch (error) {
        console.log('Tables not yet created, returning empty array');
        return [];
      }
    }
  });
};

export const useCreatePilotFlightHour = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (flightHour: Omit<PilotFlightHour, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase.rpc('execute_sql', {
          query: `
            INSERT INTO pilot_flight_hours (pilot_id, flight_id, flight_date, flight_hours, flight_type)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
          `,
          params: [
            flightHour.pilot_id,
            flightHour.flight_id || null,
            flightHour.flight_date,
            flightHour.flight_hours,
            flightHour.flight_type
          ]
        });
        
        if (error) throw error;
        return data[0];
      } catch (error) {
        console.error('Error creating pilot flight hour:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilot_flight_hours'] });
    }
  });
};

export const useCreatePilotSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (schedule: Omit<PilotSchedule, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase.rpc('execute_sql', {
          query: `
            INSERT INTO pilot_schedule (pilot_id, start_date, end_date, schedule_type, notes)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
          `,
          params: [
            schedule.pilot_id,
            schedule.start_date,
            schedule.end_date,
            schedule.schedule_type,
            schedule.notes || null
          ]
        });
        
        if (error) throw error;
        return data[0];
      } catch (error) {
        console.error('Error creating pilot schedule:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilot_schedule'] });
    }
  });
};
