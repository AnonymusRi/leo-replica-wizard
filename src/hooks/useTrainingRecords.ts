import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TrainingRecord {
  id: string;
  pilot_id: string;
  training_type: 'simulator' | 'aircraft' | 'ground_school' | 'recurrent' | 'type_rating' | 'proficiency_check';
  training_date: string;
  duration_hours: number;
  instructor_id?: string;
  training_organization: string;
  training_description: string;
  certification_achieved?: string;
  expiry_date?: string;
  counts_as_duty_time: boolean;
  counts_as_flight_time: boolean;
  ftl_applicable: boolean;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useTrainingRecords = (pilotId?: string) => {
  return useQuery({
    queryKey: ['training_records', pilotId],
    queryFn: async (): Promise<TrainingRecord[]> => {
      console.log('Fetching training records for pilot:', pilotId);
      
      let query = supabase.from('training_records').select('*');
      
      if (pilotId) {
        query = query.eq('pilot_id', pilotId);
      }
      
      const { data, error } = await query.order('training_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching training records:', error);
        toast.error('Errore nel caricamento degli addestramenti: ' + error.message);
        throw error;
      }
      
      console.log('Training records fetched:', data?.length || 0);
      return (data || []) as TrainingRecord[];
    }
  });
};

// Helper function to clean form data for database insertion
const cleanFormDataForDatabase = (record: any) => {
  const cleanedRecord = { ...record };
  
  // Convert empty strings to null for UUID fields
  if (cleanedRecord.instructor_id === '') {
    cleanedRecord.instructor_id = null;
  }
  
  // Convert empty strings to null for optional text fields
  if (cleanedRecord.certification_achieved === '') {
    cleanedRecord.certification_achieved = null;
  }
  
  if (cleanedRecord.notes === '') {
    cleanedRecord.notes = null;
  }
  
  // Handle expiry_date - convert empty string to null
  if (cleanedRecord.expiry_date === '') {
    cleanedRecord.expiry_date = null;
  }
  
  return cleanedRecord;
};

export const useCreateTrainingRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Omit<TrainingRecord, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating training record:', record);
      
      // Validazione dei campi obbligatori
      if (!record.pilot_id) {
        throw new Error('Pilota obbligatorio');
      }
      if (!record.training_description?.trim()) {
        throw new Error('Descrizione addestramento obbligatoria');
      }
      if (!record.training_organization?.trim()) {
        throw new Error('Organizzazione obbligatoria');
      }
      
      // Clean the data before sending to database
      const cleanedRecord = cleanFormDataForDatabase(record);
      console.log('Cleaned record for database:', cleanedRecord);
      
      const { data, error } = await supabase
        .from('training_records')
        .insert([cleanedRecord])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating training record:', error);
        throw error;
      }
      
      console.log('Training record created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Training record creation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['training_records'] });
      queryClient.invalidateQueries({ queryKey: ['pilot_flight_hours'] });
      queryClient.invalidateQueries({ queryKey: ['pilot_training_hours'] });
      queryClient.invalidateQueries({ queryKey: ['combined_pilot_hours'] });
      toast.success('Record di addestramento creato con successo');
    },
    onError: (error: any) => {
      console.error('Training record creation failed:', error);
      toast.error('Errore nella creazione dell\'addestramento: ' + (error.message || 'Errore sconosciuto'));
    }
  });
};

export const useUpdateTrainingRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...record }: Partial<TrainingRecord> & { id: string }) => {
      console.log('Updating training record:', id, record);
      
      // Clean the data before sending to database
      const cleanedRecord = cleanFormDataForDatabase(record);
      console.log('Cleaned record for update:', cleanedRecord);
      
      const { data, error } = await supabase
        .from('training_records')
        .update(cleanedRecord)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating training record:', error);
        throw error;
      }
      
      console.log('Training record updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Training record update successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['training_records'] });
      queryClient.invalidateQueries({ queryKey: ['pilot_flight_hours'] });
      queryClient.invalidateQueries({ queryKey: ['pilot_training_hours'] });
      queryClient.invalidateQueries({ queryKey: ['combined_pilot_hours'] });
      toast.success('Record di addestramento aggiornato');
    },
    onError: (error: any) => {
      console.error('Training record update failed:', error);
      toast.error('Errore nell\'aggiornamento dell\'addestramento: ' + (error.message || 'Errore sconosciuto'));
    }
  });
};

export const useDeleteTrainingRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting training record:', id);
      
      const { error } = await supabase
        .from('training_records')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting training record:', error);
        throw error;
      }
      
      console.log('Training record deleted successfully');
    },
    onSuccess: () => {
      console.log('Training record deletion successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['training_records'] });
      queryClient.invalidateQueries({ queryKey: ['pilot_flight_hours'] });
      queryClient.invalidateQueries({ queryKey: ['pilot_training_hours'] });
      queryClient.invalidateQueries({ queryKey: ['combined_pilot_hours'] });
      toast.success('Record di addestramento eliminato');
    },
    onError: (error: any) => {
      console.error('Training record deletion failed:', error);
      toast.error('Errore nell\'eliminazione dell\'addestramento: ' + (error.message || 'Errore sconosciuto'));
    }
  });
};
