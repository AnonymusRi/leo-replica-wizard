
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateCrewAuthData {
  email: string;
  password: string;
  crewMemberId: string;
}

export const useCreateCrewAuth = () => {
  return useMutation({
    mutationFn: async (data: CreateCrewAuthData) => {
      console.log('Creating auth account for crew member:', data.email);
      
      // Ottieni i dati del crew member
      const { data: crewMember, error: fetchError } = await supabase
        .from('crew_members')
        .select('*')
        .eq('id', data.crewMemberId)
        .single();

      if (fetchError || !crewMember) {
        throw new Error('Crew member non trovato');
      }

      // Crea l'account di autenticazione
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          first_name: crewMember.first_name,
          last_name: crewMember.last_name,
          user_type: 'crew'
        }
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        throw new Error(`Errore creazione account: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Account creato ma dati utente non disponibili');
      }

      // Crea il profilo utente
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: data.email,
          first_name: crewMember.first_name,
          last_name: crewMember.last_name,
          organization_id: crewMember.organization_id,
          is_active: true
        });

      if (profileError) {
        console.warn('Errore creazione profilo:', profileError);
      }

      console.log('Crew auth account created successfully:', {
        user: authData.user.id,
        email: data.email
      });

      return { user: authData.user, crewMember };
    },
    onSuccess: (result) => {
      toast.success(`Account di autenticazione creato per ${result.crewMember.first_name} ${result.crewMember.last_name}!`);
    },
    onError: (error: any) => {
      console.error('Crew auth creation failed:', error);
      toast.error('Errore nella creazione dell\'account: ' + error.message);
    }
  });
};
