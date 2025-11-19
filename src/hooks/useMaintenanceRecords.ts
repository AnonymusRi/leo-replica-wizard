
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MaintenanceRecord } from '@/types/database';
import { toast } from 'sonner';

export const useMaintenanceRecords = (limit: number = 50, offset: number = 0) => {
  return useQuery({
    queryKey: ['maintenance-records', limit, offset],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('maintenance_records')
        .select(`
          *,
          aircraft:aircraft(*),
          technician:crew_members(*)
        `, { count: 'exact' })
        .order('scheduled_date', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return { data: data as MaintenanceRecord[], count: count || 0 };
    }
  });
};

export const useMaintenanceRecord = (id: string) => {
  return useQuery({
    queryKey: ['maintenance-record', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .select(`
          *,
          aircraft:aircraft(*),
          technician:crew_members(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as MaintenanceRecord;
    },
    enabled: !!id
  });
};

export const useMaintenanceByAircraft = (aircraftId: string) => {
  return useQuery({
    queryKey: ['maintenance-records', 'aircraft', aircraftId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .select(`
          *,
          aircraft:aircraft(*),
          technician:crew_members(*)
        `)
        .eq('aircraft_id', aircraftId)
        .order('scheduled_date', { ascending: false });
      
      if (error) throw error;
      return data as MaintenanceRecord[];
    },
    enabled: !!aircraftId
  });
};

export const useCreateMaintenanceRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (maintenanceData: Omit<MaintenanceRecord, 'id' | 'created_at' | 'updated_at' | 'aircraft' | 'technician'>) => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .insert(maintenanceData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-records'] });
      toast.success('Maintenance record created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create maintenance record: ' + error.message);
    }
  });
};

export const useUpdateMaintenanceRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...maintenanceData }: Partial<MaintenanceRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .update(maintenanceData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-records'] });
      toast.success('Maintenance record updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update maintenance record: ' + error.message);
    }
  });
};
