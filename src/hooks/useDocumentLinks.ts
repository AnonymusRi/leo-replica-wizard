
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DocumentLink {
  id: string;
  document_id?: string;
  document_type: string;
  entity_id: string;
  entity_type: string;
  link_type: 'attachment' | 'reference' | 'generated';
  created_at: string;
  created_by?: string;
}

export const useDocumentLinks = (entityId?: string, entityType?: string) => {
  return useQuery({
    queryKey: ['document-links', entityId, entityType],
    queryFn: async () => {
      let query = supabase
        .from('document_links')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (entityId) {
        query = query.eq('entity_id', entityId);
      }
      
      if (entityType) {
        query = query.eq('entity_type', entityType);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as DocumentLink[];
    },
    enabled: !!(entityId && entityType)
  });
};

export const useCreateDocumentLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (linkData: Omit<DocumentLink, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('document_links')
        .insert(linkData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-links'] });
      toast.success('Documento collegato con successo');
    },
    onError: (error) => {
      toast.error('Errore collegamento documento: ' + error.message);
    }
  });
};
