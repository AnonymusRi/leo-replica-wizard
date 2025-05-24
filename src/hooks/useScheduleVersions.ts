
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScheduleVersion } from '@/types/database';
import { toast } from 'sonner';

export const useScheduleVersions = () => {
  return useQuery({
    queryKey: ['schedule-versions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedule_versions')
        .select(`
          *,
          client:clients(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ScheduleVersion[];
    }
  });
};

export const useScheduleVersion = (id: string) => {
  return useQuery({
    queryKey: ['schedule-version', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedule_versions')
        .select(`
          *,
          client:clients(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as ScheduleVersion;
    },
    enabled: !!id
  });
};

export const useCreateScheduleVersion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (versionData: Omit<ScheduleVersion, 'id' | 'created_at' | 'updated_at' | 'client'>) => {
      const { data, error } = await supabase
        .from('schedule_versions')
        .insert(versionData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-versions'] });
      toast.success('Schedule version created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create schedule version: ' + error.message);
    }
  });
};

export const useUpdateScheduleVersion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...versionData }: Partial<ScheduleVersion> & { id: string }) => {
      const { data, error } = await supabase
        .from('schedule_versions')
        .update(versionData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-versions'] });
      toast.success('Schedule version updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update schedule version: ' + error.message);
    }
  });
};

export const useActivateScheduleVersion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // First deactivate all other versions
      await supabase
        .from('schedule_versions')
        .update({ is_active: false })
        .neq('id', id);

      // Then activate the selected version
      const { data, error } = await supabase
        .from('schedule_versions')
        .update({ is_active: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-versions'] });
      toast.success('Schedule version activated successfully');
    },
    onError: (error) => {
      toast.error('Failed to activate schedule version: ' + error.message);
    }
  });
};
