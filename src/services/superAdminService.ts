
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SuperAdminData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class SuperAdminService {
  private debugInfo: string[] = [];
  private onDebugUpdate: (info: string[]) => void;

  constructor(onDebugUpdate: (info: string[]) => void) {
    this.onDebugUpdate = onDebugUpdate;
  }

  private addDebugInfo(message: string) {
    console.log('DEBUG:', message);
    this.debugInfo.push(message);
    this.onDebugUpdate([...this.debugInfo]);
  }

  async createSuperAdmin(formData: SuperAdminData): Promise<boolean> {
    this.debugInfo = [];
    
    try {
      this.addDebugInfo('Avvio creazione super admin...');
      
      // Step 1: Verifica se l'organizzazione esiste
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('slug', 'spiral-admin')
        .single();

      if (orgError) {
        this.addDebugInfo('Errore nel recupero organizzazione: ' + orgError.message);
        toast.error('Errore nel recupero organizzazione: ' + orgError.message);
        return false;
      }

      this.addDebugInfo(`Organizzazione trovata: ${orgData.name} (${orgData.id})`);

      // Step 2: Tentativo di registrazione
      this.addDebugInfo('Tentativo di registrazione utente...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        }
      });

      let userId: string | null = null;

      if (signUpError) {
        this.addDebugInfo('Errore signup: ' + signUpError.message);
        
        // Se l'utente esiste già, prova a fare login
        if (signUpError.message.includes('User already registered')) {
          this.addDebugInfo('Utente già registrato, tentativo di login...');
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          });

          if (loginError) {
            this.addDebugInfo('Errore login: ' + loginError.message);
            toast.error('Errore durante il login: ' + loginError.message);
            return false;
          }

          userId = loginData.user?.id || null;
          this.addDebugInfo(`Login riuscito per utente esistente: ${userId}`);
        } else {
          toast.error('Errore durante la registrazione: ' + signUpError.message);
          return false;
        }
      } else {
        userId = signUpData.user?.id || null;
        this.addDebugInfo(`Utente creato con successo: ${userId}`);
      }

      if (!userId) {
        this.addDebugInfo('Nessun ID utente disponibile');
        toast.error('Errore: nessun ID utente disponibile');
        return false;
      }

      // Step 3: Aggiorna il profilo utente
      this.addDebugInfo('Aggiornamento profilo utente...');
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          organization_id: orgData.id,
          first_name: formData.firstName,
          last_name: formData.lastName
        })
        .eq('id', userId);

      if (profileError) {
        this.addDebugInfo('Errore aggiornamento profilo: ' + profileError.message);
        // Non bloccare il processo per errori di profilo
      } else {
        this.addDebugInfo('Profilo aggiornato con successo');
      }

      // Step 4: Crea il ruolo super admin
      this.addDebugInfo('Creazione ruolo super admin...');
      const { data: roleData, error: roleError } = await supabase
        .rpc('create_user_role', {
          p_user_id: userId,
          p_organization_id: orgData.id,
          p_role: 'super_admin',
          p_module_permissions: ['all']
        });

      if (roleError) {
        this.addDebugInfo('Errore creazione ruolo: ' + roleError.message);
        toast.error('Errore nell\'assegnazione ruolo: ' + roleError.message);
        return false;
      }

      this.addDebugInfo('Ruolo super admin creato con successo');
      toast.success('Super admin creato con successo! Puoi ora effettuare il login.');
      return true;

    } catch (error: any) {
      this.addDebugInfo('Errore imprevisto: ' + error.message);
      console.error('Errore imprevisto:', error);
      toast.error('Errore imprevisto: ' + error.message);
      return false;
    }
  }
}
