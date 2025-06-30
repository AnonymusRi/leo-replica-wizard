
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, User, Shield, Database } from 'lucide-react';

const SuperAdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    email: 'admin@gmail.com',
    password: 'SuperAdmin123!',
    firstName: 'Super',
    lastName: 'Admin'
  });

  const addDebugInfo = (message: string) => {
    console.log('DEBUG:', message);
    setDebugInfo(prev => [...prev, message]);
  };

  const createSuperAdminDirect = async () => {
    setIsLoading(true);
    setDebugInfo([]);
    
    try {
      addDebugInfo('Avvio creazione super admin...');
      
      // Step 1: Verifica se l'organizzazione esiste
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('slug', 'spiral-admin')
        .single();

      if (orgError) {
        addDebugInfo('Errore nel recupero organizzazione: ' + orgError.message);
        toast.error('Errore nel recupero organizzazione: ' + orgError.message);
        return;
      }

      addDebugInfo(`Organizzazione trovata: ${orgData.name} (${orgData.id})`);

      // Step 2: Tentativo di registrazione
      addDebugInfo('Tentativo di registrazione utente...');
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
        addDebugInfo('Errore signup: ' + signUpError.message);
        
        // Se l'utente esiste già, prova a fare login
        if (signUpError.message.includes('User already registered')) {
          addDebugInfo('Utente già registrato, tentativo di login...');
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          });

          if (loginError) {
            addDebugInfo('Errore login: ' + loginError.message);
            toast.error('Errore durante il login: ' + loginError.message);
            return;
          }

          userId = loginData.user?.id || null;
          addDebugInfo(`Login riuscito per utente esistente: ${userId}`);
        } else {
          toast.error('Errore durante la registrazione: ' + signUpError.message);
          return;
        }
      } else {
        userId = signUpData.user?.id || null;
        addDebugInfo(`Utente creato con successo: ${userId}`);
      }

      if (!userId) {
        addDebugInfo('Nessun ID utente disponibile');
        toast.error('Errore: nessun ID utente disponibile');
        return;
      }

      // Step 3: Aggiorna il profilo utente
      addDebugInfo('Aggiornamento profilo utente...');
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          organization_id: orgData.id,
          first_name: formData.firstName,
          last_name: formData.lastName
        })
        .eq('id', userId);

      if (profileError) {
        addDebugInfo('Errore aggiornamento profilo: ' + profileError.message);
        // Non bloccare il processo per errori di profilo
      } else {
        addDebugInfo('Profilo aggiornato con successo');
      }

      // Step 4: Crea il ruolo super admin
      addDebugInfo('Creazione ruolo super admin...');
      const { data: roleData, error: roleError } = await supabase
        .rpc('create_user_role', {
          p_user_id: userId,
          p_organization_id: orgData.id,
          p_role: 'super_admin',
          p_module_permissions: ['all']
        });

      if (roleError) {
        addDebugInfo('Errore creazione ruolo: ' + roleError.message);
        toast.error('Errore nell\'assegnazione ruolo: ' + roleError.message);
        return;
      }

      addDebugInfo('Ruolo super admin creato con successo');
      setIsCreated(true);
      toast.success('Super admin creato con successo! Puoi ora effettuare il login.');

    } catch (error: any) {
      addDebugInfo('Errore imprevisto: ' + error.message);
      console.error('Errore imprevisto:', error);
      toast.error('Errore imprevisto: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCreated) {
    return (
      <Card className="w-full max-w-lg mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            Super Admin Creato con Successo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Il super admin è stato creato e configurato correttamente!
              <br />
              <br />
              <strong>Credenziali:</strong>
              <br />
              <strong>Email:</strong> {formData.email}
              <br />
              <strong>Password:</strong> {formData.password}
              <br />
              <br />
              Puoi ora tornare al login e accedere al sistema.
            </AlertDescription>
          </Alert>
          
          {debugInfo.length > 0 && (
            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription>
                <strong>Log di debug:</strong>
                <div className="mt-2 text-xs space-y-1">
                  {debugInfo.map((info, index) => (
                    <div key={index} className="text-gray-600">
                      {index + 1}. {info}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={() => {
              setIsCreated(false);
              setDebugInfo([]);
            }}
            variant="outline" 
            className="w-full"
          >
            Crea un altro Super Admin
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Setup Super Admin
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>
            Questo strumento creerà un super admin con accesso completo al sistema.
            Le politiche RLS sono state configurate correttamente.
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
          onClick={createSuperAdminDirect} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creazione in corso...' : 'Crea Super Admin'}
        </Button>
        
        {debugInfo.length > 0 && (
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              <strong>Log di debug:</strong>
              <div className="mt-2 text-xs space-y-1 max-h-32 overflow-y-auto">
                {debugInfo.map((info, index) => (
                  <div key={index} className="text-gray-600">
                    {index + 1}. {info}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SuperAdminSetup;
