
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCreateScheduleVersion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      client_id?: string;
    }) => {
      const { data: result, error } = await supabase
        .from('schedule_versions')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
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

export const usePublishSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      schedule_version_id: string;
      flight_ids: string[];
      trip_type?: string;
      is_option?: boolean;
      is_commercial?: boolean;
    }) => {
      const publishedSchedules = data.flight_ids.map(flight_id => ({
        schedule_version_id: data.schedule_version_id,
        flight_id,
        trip_type: data.trip_type || 'PAX Charter',
        is_option: data.is_option || false,
        is_commercial: data.is_commercial || true,
        published_by: 'system' // In a real app, this would be the current user
      }));

      const { data: result, error } = await supabase
        .from('published_schedules')
        .insert(publishedSchedules)
        .select();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['published-schedules'] });
      toast.success('Schedule published successfully');
    },
    onError: (error) => {
      toast.error('Failed to publish schedule: ' + error.message);
    }
  });
};

export const useAssignCrewToFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      flight_id: string;
      crew_member_id: string;
      position: string;
      notes?: string;
    }) => {
      const { data: result, error } = await supabase
        .from('flight_assignments')
        .insert({
          ...data,
          assigned_by: 'system' // In a real app, this would be the current user
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flight-assignments'] });
      toast.success('Crew assigned to flight successfully');
    },
    onError: (error) => {
      toast.error('Failed to assign crew: ' + error.message);
    }
  });
};

export const useCreateScheduleChange = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      flight_id: string;
      change_type: string;
      old_value?: any;
      new_value?: any;
      reason?: string;
    }) => {
      const { data: result, error } = await supabase
        .from('schedule_changes')
        .insert({
          ...data,
          changed_by: 'system' // In a real app, this would be the current user
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-changes'] });
      toast.success('Schedule change recorded');
    },
    onError: (error) => {
      toast.error('Failed to record schedule change: ' + error.message);
    }
  });
};
