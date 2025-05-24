
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FlightDocument {
  id: string;
  flight_id?: string;
  document_type: string;
  name: string;
  template_content: string;
  generated_content?: string;
  is_generated?: boolean;
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
  return useQuery<FlightDocument[]>({
    queryKey: ['flight-documents', flightId],
    queryFn: async (): Promise<FlightDocument[]> => {
      let query = supabase
        .from('sales_documents')
        .select('*')
        .order('document_type');
      
      if (flightId) {
        query = query.eq('flight_id', flightId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: FlightDocument[] = (data || []).map(doc => ({
        id: doc.id,
        flight_id: flightId,
        document_type: doc.document_type,
        name: doc.name,
        template_content: doc.template_content,
        generated_content: undefined,
        is_generated: false,
        is_active: doc.is_active,
        created_at: doc.created_at,
        updated_at: doc.updated_at
      }));
      
      return transformedData;
    }
  });
};

export const useHandlingRequests = (flightId?: string) => {
  return useQuery<HandlingRequest[]>({
    queryKey: ['handling-requests', flightId],
    queryFn: async (): Promise<HandlingRequest[]> => {
      // Simulate handling requests data since we don't have the table yet
      return [];
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
    }): Promise<FlightDocument> => {
      // Simulate document generation
      const generatedContent = data.templateContent.replace(/\{\{flight_number\}\}/g, 'FL001');
      
      const newDocument: FlightDocument = {
        id: crypto.randomUUID(),
        flight_id: data.flightId,
        document_type: data.documentType,
        name: `Generated ${data.documentType}`,
        template_content: data.templateContent,
        generated_content: generatedContent,
        is_generated: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return newDocument;
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
    }): Promise<HandlingRequest> => {
      // Simulate sending handling request
      const newRequest: HandlingRequest = {
        id: crypto.randomUUID(),
        ...requestData,
        status: 'sent',
        requested_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      return newRequest;
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
