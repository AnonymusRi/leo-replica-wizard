
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
    queryFn: async (): Promise<PilotFlightHour[]> => {
      let query = supabase.from('pilot_flight_hours').select('*');
      
      if (pilotId) {
        query = query.eq('pilot_id', pilotId);
      }
      
      const { data, error } = await query.order('flight_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching pilot flight hours:', error);
        return [];
      }
      
      return data || [];
    }
  });
};

export const usePilotSchedule = (pilotId?: string) => {
  return useQuery({
    queryKey: ['pilot_schedule', pilotId],
    queryFn: async (): Promise<PilotSchedule[]> => {
      let query = supabase.from('pilot_schedule').select('*');
      
      if (pilotId) {
        query = query.eq('pilot_id', pilotId);
      }
      
      const { data, error } = await query.order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching pilot schedule:', error);
        return [];
      }
      
      return data || [];
    }
  });
};

export const useFlightTimeLimits = () => {
  return useQuery({
    queryKey: ['flight_time_limits'],
    queryFn: async (): Promise<FlightTimeLimit[]> => {
      const { data, error } = await supabase
        .from('flight_time_limits')
        .select('*')
        .order('regulation_name');
      
      if (error) {
        console.error('Error fetching flight time limits:', error);
        return [];
      }
      
      return data || [];
    }
  });
};

export const useCreatePilotFlightHour = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (flightHour: Omit<PilotFlightHour, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('pilot_flight_hours')
        .insert([{
          pilot_id: flightHour.pilot_id,
          flight_id: flightHour.flight_id || null,
          flight_date: flightHour.flight_date,
          flight_hours: flightHour.flight_hours,
          flight_type: flightHour.flight_type
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('pilot_schedule')
        .insert([{
          pilot_id: schedule.pilot_id,
          start_date: schedule.start_date,
          end_date: schedule.end_date,
          schedule_type: schedule.schedule_type,
          notes: schedule.notes || null
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilot_schedule'] });
    }
  });
};
