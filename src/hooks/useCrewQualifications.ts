
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CrewQualification } from '@/types/database';

export const useCrewQualifications = () => {
  return useQuery({
    queryKey: ['crew-qualifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crew_qualifications')
        .select(`
          *,
          crew_member:crew_members(*)
        `)
        .eq('is_active', true)
        .order('expiry_date');
      
      if (error) throw error;
      return data as CrewQualification[];
    }
  });
};

export const useCrewQualificationsByMember = (crewMemberId: string) => {
  return useQuery({
    queryKey: ['crew-qualifications', crewMemberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crew_qualifications')
        .select('*')
        .eq('crew_member_id', crewMemberId)
        .eq('is_active', true)
        .order('expiry_date');
      
      if (error) throw error;
      return data as CrewQualification[];
    },
    enabled: !!crewMemberId
  });
};
