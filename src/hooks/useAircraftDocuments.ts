
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AircraftDocument } from '@/types/aircraft';
import { toast } from 'sonner';

export const useAircraftDocuments = () => {
  return useQuery({
    queryKey: ['aircraft-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aircraft_documents')
        .select(`
          *,
          aircraft:aircraft(*)
        `)
        .order('expiry_date', { ascending: true });
      
      if (error) throw error;
      return data as AircraftDocument[];
    }
  });
};

export const useAircraftDocumentsByAircraft = (aircraftId: string) => {
  return useQuery({
    queryKey: ['aircraft-documents', aircraftId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aircraft_documents')
        .select(`
          *,
          aircraft:aircraft(*)
        `)
        .eq('aircraft_id', aircraftId)
        .order('expiry_date', { ascending: true });
      
      if (error) throw error;
      return data as AircraftDocument[];
    },
    enabled: !!aircraftId
  });
};

export const useExpiringDocuments = () => {
  return useQuery({
    queryKey: ['expiring-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aircraft_documents')
        .select(`
          *,
          aircraft:aircraft(*)
        `)
        .in('status', ['expired', 'expiring_soon'])
        .order('expiry_date', { ascending: true });
      
      if (error) throw error;
      return data as AircraftDocument[];
    }
  });
};

export const useCreateAircraftDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (document: Omit<AircraftDocument, 'id' | 'created_at' | 'updated_at' | 'aircraft'>) => {
      const { data, error } = await supabase
        .from('aircraft_documents')
        .insert(document)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft-documents'] });
      toast.success('Aircraft document created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create aircraft document: ' + error.message);
    }
  });
};
