
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, startOfMonth } from 'date-fns';

export interface CrewStatistics {
  id: string;
  crew_member_id: string;
  month_year: string;
  total_flight_hours: number;
  total_duty_hours: number;
  total_flights: number;
  total_sectors: number;
  night_hours: number;
  simulator_hours: number;
  training_hours: number;
  days_off: number;
  ftl_violations: number;
  performance_rating?: number;
  created_at: string;
  updated_at: string;
}

export const useCrewStatistics = (crewMemberId: string, months: number = 12) => {
  return useQuery({
    queryKey: ['crew-statistics', crewMemberId, months],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crew_statistics')
        .select('*')
        .eq('crew_member_id', crewMemberId)
        .order('month_year', { ascending: false })
        .limit(months);
      
      if (error) throw error;
      return data as CrewStatistics[];
    },
    enabled: !!crewMemberId
  });
};

export const useCurrentMonthStatistics = (crewMemberId: string) => {
  return useQuery({
    queryKey: ['current-month-statistics', crewMemberId],
    queryFn: async () => {
      const currentMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('crew_statistics')
        .select('*')
        .eq('crew_member_id', crewMemberId)
        .eq('month_year', currentMonth)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as CrewStatistics | null;
    },
    enabled: !!crewMemberId
  });
};
