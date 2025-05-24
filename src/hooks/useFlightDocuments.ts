
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FlightDocument {
  id: string;
  flight_id?: string;
  document_type: string;
  document_name: string;
  template_content: string;
  generated_content?: string;
  is_generated: boolean;
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
        .from('sales_documents')
        .select('*')
        .order('document_type');
      
      if (flightId) {
        query = query.eq('flight_id', flightId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as FlightDocument[];
    }
  });
};

export const useHandlingRequests = (flightId?: string) => {
  return useQuery({
    queryKey: ['handling-requests', flightId],
    queryFn: async () => {
      // Simulate handling requests data since we don't have the table yet
      return [] as HandlingRequest[];
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
      templateContent: string;
    }) => {
      // Simulate document generation
      const generatedContent = data.templateContent.replace(/\{\{flight_number\}\}/g, 'FL001');
      
      return {
        id: crypto.randomUUID(),
        flight_id: data.flightId,
        document_type: data.documentType,
        generated_content: generatedContent,
        is_generated: true
      };
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
      // Simulate sending handling request
      return {
        id: crypto.randomUUID(),
        ...requestData,
        status: 'sent' as const,
        requested_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
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
