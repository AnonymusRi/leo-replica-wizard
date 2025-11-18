
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

      // Crea l'account utente per l'autenticazione
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

      if (authError) {
        console.error('Auth error:', authError);
        throw new Error(`Errore creazione account: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Account creato ma dati utente non disponibili');
      }

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

      if (crewError) {
        console.error('Crew member error:', crewError);
        throw new Error(`Errore creazione crew member: ${crewError.message}`);
      }

      // Crea il profilo utente collegato all'account auth
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

      if (profileError) {
        console.warn('Errore creazione profilo:', profileError);
        // Non blocchiamo per questo errore, il profilo può essere creato dopo
      }

      console.log('Account crew creato con successo:', {
        user: authData.user.id,
        crewMember: crewData.id,
        email: data.email
      });

      return { user: authData.user, crewMember: crewData };
    },
    onSuccess: (result) => {
      toast.success(`Account crew creato con successo per ${result.crewMember.first_name} ${result.crewMember.last_name}!`);
      console.log('Crew account creation successful:', result);
    },
    onError: (error: any) => {
      console.error('Crew account creation failed:', error);
      toast.error('Errore nella creazione dell\'account: ' + error.message);
    }
  });
};
