
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

      if (fetchError) {
        console.error('Error fetching crew member:', fetchError);
        throw new Error('Crew member non trovato');
      }

      if (!crewMember) {
        throw new Error('Crew member non trovato');
      }

      console.log('Found crew member:', crewMember);

      // Crea l'account di autenticazione con signUp normale
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/crew-dashboard`,
          data: {
            first_name: crewMember.first_name,
            last_name: crewMember.last_name,
            user_type: 'crew'
          }
        }
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        throw new Error(`Errore creazione account: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Account creato ma dati utente non disponibili');
      }

      console.log('Auth account created successfully:', authData.user.id);

      // Crea il profilo utente se non esiste già
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            first_name: crewMember.first_name,
            last_name: crewMember.last_name,
            organization_id: crewMember.organization_id,
            is_active: true
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Non bloccare il processo per errori di profilo
        }
      }

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
