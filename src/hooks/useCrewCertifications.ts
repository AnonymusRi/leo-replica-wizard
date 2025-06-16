
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CrewCertification, AircraftCertificationRequirement, EnacNotification } from '@/types/certification';
import { toast } from 'sonner';

export const useCrewCertifications = (crewMemberId?: string) => {
  return useQuery({
    queryKey: ['crew-certifications', crewMemberId],
    queryFn: async () => {
      let query = supabase
        .from('crew_certifications')
        .select('*')
        .eq('is_active', true);
      
      if (crewMemberId) {
        query = query.eq('crew_member_id', crewMemberId);
      }
      
      const { data, error } = await query.order('expiry_date');
      
      if (error) throw error;
      return data as CrewCertification[];
    },
    enabled: !!crewMemberId || crewMemberId === undefined
  });
};

export const useAircraftCertificationRequirements = (aircraftId?: string) => {
  return useQuery({
    queryKey: ['aircraft-certification-requirements', aircraftId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aircraft_certification_requirements')
        .select('*')
        .eq('aircraft_id', aircraftId);
      
      if (error) throw error;
      return data as AircraftCertificationRequirement[];
    },
    enabled: !!aircraftId
  });
};

export const useCreateEnacNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notification: Omit<EnacNotification, 'id' | 'created_at' | 'notification_date'>) => {
      const { data, error } = await supabase
        .from('enac_notifications')
        .insert([notification])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enac-notifications'] });
      toast.success('Notifica ENAC creata con successo');
    },
    onError: (error) => {
      toast.error('Errore nella creazione della notifica ENAC: ' + error.message);
    }
  });
};

export const useEnacNotifications = () => {
  return useQuery({
    queryKey: ['enac-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enac_notifications')
        .select(`
          *,
          crew_member:crew_members(*),
          flight:flights(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};
