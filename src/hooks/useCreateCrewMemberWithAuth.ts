
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateCrewMemberWithAuthData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  position: 'captain' | 'first_officer' | 'cabin_crew' | 'mechanic';
  organizationName: string;
}

export const useCreateCrewMemberWithAuth = () => {
  return useMutation({
    mutationFn: async (data: CreateCrewMemberWithAuthData) => {
      // Prima trova l'organizzazione
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('name', data.organizationName)
        .single();

      if (orgError || !org) {
        throw new Error(`Organizzazione "${data.organizationName}" non trovata`);
      }

      // Crea l'account utente
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/crew-dashboard`,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            user_type: 'crew'
          }
        }
      });

      if (authError) throw authError;

      // Crea il membro dell'equipaggio
      const { data: crewData, error: crewError } = await supabase
        .from('crew_members')
        .insert([{
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          position: data.position,
          organization_id: org.id,
          is_active: true
        }])
        .select()
        .single();

      if (crewError) throw crewError;

      // Crea il profilo se non esiste già
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            organization_id: org.id,
            is_active: true
          });

        if (profileError && !profileError.message.includes('duplicate key')) {
          console.warn('Errore creazione profilo:', profileError);
        }
      }

      return { user: authData.user, crewMember: crewData };
    },
    onSuccess: () => {
      toast.success('Account crew creato con successo!');
    },
    onError: (error: any) => {
      toast.error('Errore nella creazione dell\'account: ' + error.message);
    }
  });
};
