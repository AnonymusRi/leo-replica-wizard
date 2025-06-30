
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, User } from 'lucide-react';

const SuperAdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [formData, setFormData] = useState({
    email: 'admin@gmail.com',
    password: 'SuperAdmin123!',
    firstName: 'Super',
    lastName: 'Admin'
  });

  const createSuperAdminSimple = async () => {
    setIsLoading(true);
    try {
      console.log('Tentativo di creazione super admin semplificato...');
      
      // Tentativo di login per vedere se l'utente esiste già
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (loginData.user && !loginError) {
        console.log('Utente già esistente, procedo con assegnazione ruolo');
        await assignSuperAdminRole(loginData.user.id);
        return;
      }

      // Se l'utente non esiste, provo a crearlo con opzioni semplificate
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        }
      });

      if (signUpError) {
        console.error('Errore signup:', signUpError);
        
        if (signUpError.message.includes('rate limit') || signUpError.message.includes('429')) {
          toast.error('Troppi tentativi. Riprova tra qualche minuto con un indirizzo Gmail.');
          return;
        }
        
        if (signUpError.message.includes('User already registered')) {
          toast.success('Utente già registrato! Procedo con l\'assegnazione del ruolo...');
          // Provo a fare login
          const { data: existingUser } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          });
          
          if (existingUser.user) {
            await assignSuperAdminRole(existingUser.user.id);
          }
          return;
        }
        
        toast.error('Errore: ' + signUpError.message);
        return;
      }

      if (signUpData.user) {
        console.log('Utente creato:', signUpData.user.id);
        await assignSuperAdminRole(signUpData.user.id);
      } else {
        toast.error('Errore nella creazione utente');
      }

    } catch (error) {
      console.error('Errore imprevisto:', error);
      toast.error('Errore imprevisto nella creazione del super admin');
    } finally {
      setIsLoading(false);
    }
  };

  const assignSuperAdminRole = async (userId: string) => {
    try {
      // Recupera l'organizzazione spiral-admin
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', 'spiral-admin')
        .single();

      if (orgError) {
        console.error('Errore organizzazione:', orgError);
        toast.error('Errore nel recupero organizzazione: ' + orgError.message);
        return;
      }

      console.log('Organizzazione trovata:', orgData.id);

      // Aggiorna il profilo utente
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          organization_id: orgData.id
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Errore aggiornamento profilo:', profileError);
      }

      // Crea il ruolo super admin
      const { data: roleData, error: roleError } = await supabase
        .rpc('create_user_role', {
          p_user_id: userId,
          p_organization_id: orgData.id,
          p_role: 'super_admin',
          p_module_permissions: ['all']
        });

      if (roleError) {
        console.error('Errore ruolo:', roleError);
        toast.error('Errore nell\'assegnazione ruolo: ' + roleError.message);
      } else {
        console.log('Ruolo creato con successo');
        setIsCreated(true);
        toast.success('Super admin creato con successo! Puoi ora effettuare il login.');
      }
    } catch (err) {
      console.error('Errore nell\'assegnazione ruolo:', err);
      toast.error('Errore nell\'assegnazione del ruolo');
    }
  };

  if (isCreated) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            Super Admin Creato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <User className="h-4 w-4" />
            <AlertDescription>
              Il super admin è stato creato con successo! Puoi ora tornare al login e accedere con le credenziali:
              <br />
              <strong>Email:</strong> {formData.email}
              <br />
              <strong>Password:</strong> {formData.password}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Setup Super Admin Semplificato</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Questo metodo semplificato evita i problemi di conferma email e limiti di rate.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="admin@gmail.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nome</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Cognome</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>
        <Button 
          onClick={createSuperAdminSimple} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creazione in corso...' : 'Crea Super Admin'}
        </Button>
        
        <div className="text-sm text-gray-600 mt-4">
          <p><strong>Nota:</strong> Questo metodo semplificato gestisce automaticamente utenti esistenti e bypassa i problemi di conferma email.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuperAdminSetup;
