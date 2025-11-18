
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface CrewFatigueRecord {
  id: string;
  crew_member_id: string;
  assessment_date: string;
  fatigue_level?: number;
  sleep_hours?: number;
  stress_level?: number;
  workload_rating?: number;
  notes?: string;
  auto_calculated: boolean;
  created_at: string;
}

export const useCrewFatigueRecords = (crewMemberId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['crew-fatigue', crewMemberId, days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crew_fatigue_records')
        .select('*')
        .eq('crew_member_id', crewMemberId)
        .order('assessment_date', { ascending: false })
        .limit(days);
      
      if (error) throw error;
      return data as CrewFatigueRecord[];
    },
    enabled: !!crewMemberId
  });
};

export const useTodayFatigueRecord = (crewMemberId: string) => {
  return useQuery({
    queryKey: ['today-fatigue', crewMemberId],
    queryFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('crew_fatigue_records')
        .select('*')
        .eq('crew_member_id', crewMemberId)
        .eq('assessment_date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as CrewFatigueRecord | null;
    },
    enabled: !!crewMemberId
  });
};

export const useCreateFatigueRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Omit<CrewFatigueRecord, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('crew_fatigue_records')
        .upsert([record])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crew-fatigue'] });
      queryClient.invalidateQueries({ queryKey: ['today-fatigue'] });
      toast.success('Valutazione fatica registrata');
    },
    onError: (error) => {
      toast.error('Errore registrazione fatica: ' + error.message);
    }
  });
};
