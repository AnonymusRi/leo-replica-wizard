
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FlightDocument {
  id: string;
  flight_id?: string;
  document_type: string;
  document_name: string;
  template_content?: string;
  generated_content?: string;
  is_generated: boolean;
  file_path?: string;
  generated_at?: string;
  generated_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HandlingRequest {
  id: string;
  flight_id?: string;
  airport_code: string;
  service_type: string;
  request_details: string;
  status: 'pending' | 'sent' | 'confirmed' | 'rejected';
  requested_by?: string;
  requested_at: string;
  response_received_at?: string;
  notes?: string;
  created_at: string;
}

export const useFlightDocuments = (flightId?: string) => {
  return useQuery({
    queryKey: ['flight-documents', flightId],
    queryFn: async () => {
      let query = supabase
        .from('flight_documents')
        .select('*')
        .order('document_type');
      
      if (flightId) {
        query = query.eq('flight_id', flightId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    }
  });
};

export const useHandlingRequests = (flightId?: string) => {
  return useQuery({
    queryKey: ['handling-requests', flightId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('handling_requests')
        .select('*')
        .eq('flight_id', flightId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!flightId
  });
};

export const useGenerateDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      flightId: string;
      documentType: string;
      documentName: string;
      templateContent: string;
    }) => {
      const generatedContent = data.templateContent.replace(/\{\{flight_number\}\}/g, 'FL001');
      
      const { data: document, error } = await supabase
        .from('flight_documents')
        .insert({
          flight_id: data.flightId,
          document_type: data.documentType,
          document_name: data.documentName,
          template_content: data.templateContent,
          generated_content: generatedContent,
          is_generated: true,
          generated_at: new Date().toISOString(),
          generated_by: 'Current User'
        })
        .select()
        .single();
      
      if (error) throw error;
      return document;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['flight-documents', variables.flightId] });
      toast.success('Documento generato con successo');
    },
    onError: (error) => {
      toast.error('Errore nella generazione del documento: ' + error.message);
    }
  });
};

export const useSendHandlingRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (requestData: {
      flight_id: string;
      airport_code: string;
      service_type: string;
      request_details: string;
      requested_by: string;
    }) => {
      const { data, error } = await supabase
        .from('handling_requests')
        .insert({
          ...requestData,
          status: 'sent'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['handling-requests', variables.flight_id] });
      toast.success('Richiesta handling inviata');
    },
    onError: (error) => {
      toast.error('Errore invio richiesta: ' + error.message);
    }
  });
};
