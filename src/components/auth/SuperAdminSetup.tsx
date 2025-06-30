
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const SuperAdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [formData, setFormData] = useState({
    email: 'admin@gmail.com', // Changed to a more reliable domain
    password: 'SuperAdmin123!',
    firstName: 'Super',
    lastName: 'Admin'
  });

  const createSuperAdmin = async () => {
    setIsLoading(true);
    try {
      console.log('Attempting to create super admin with email:', formData.email);
      
      // Validate email format first
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Formato email non valido');
        return;
      }

      // Check if we should show email warning for custom domains
      if (formData.email.includes('@spiralapp.it') || !formData.email.includes('@gmail.com')) {
        setShowEmailWarning(true);
      }
      
      // First, sign up the user with auto-confirm disabled to avoid email limits
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email_confirm: false // Try to skip email confirmation
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        
        // Handle specific error cases
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          toast.error('Troppi tentativi di registrazione. Attendi qualche minuto e riprova, oppure usa un indirizzo Gmail.');
          setShowEmailWarning(true);
          return;
        } else if (error.message.includes('invalid') || error.message.includes('domain')) {
          toast.error('Dominio email non valido. Prova con un indirizzo Gmail (@gmail.com)');
          setShowEmailWarning(true);
          return;
        } else if (error.message.includes('already')) {
          // User already exists, try to proceed with role assignment
          console.log('User already exists, proceeding with role assignment');
          toast.success('Utente già esistente, procedo con l\'assegnazione del ruolo...');
          
          // Get existing user
          const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          });
          
          if (signInError) {
            toast.error('Errore nel login dell\'utente esistente: ' + signInError.message);
            return;
          }
          
          if (user) {
            await handleRoleAssignment(user.id);
          }
          return;
        } else {
          toast.error('Errore durante la registrazione: ' + error.message);
          return;
        }
      }

      if (data.user) {
        console.log('Super admin creato con successo:', data.user.id);
        await handleRoleAssignment(data.user.id);
      } else {
        console.log('User creation returned no user object');
        toast.error('Errore: nessun utente creato');
      }
    } catch (error) {
      console.error('Unexpected error creating super admin:', error);
      toast.error('Errore imprevisto durante la creazione del super admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleAssignment = async (userId: string) => {
    try {
      // Get the spiral-admin organization ID
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', 'spiral-admin')
        .single();

      if (orgError) {
        console.error('Error fetching organization:', orgError);
        toast.error('Errore nel recupero dell\'organizzazione: ' + orgError.message);
        return;
      }

      console.log('Organization found:', orgData);

      // Update the user's organization
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          organization_id: orgData.id
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        toast.success('Utente creato ma errore nell\'aggiornamento del profilo: ' + updateError.message);
      }

      console.log('Profile updated successfully');

      // Use the secure function to create the super admin role
      const { data: roleData, error: roleError } = await supabase
        .rpc('create_user_role', {
          p_user_id: userId,
          p_organization_id: orgData.id,
          p_role: 'super_admin',
          p_module_permissions: ['all']
        });

      if (roleError) {
        console.error('Error creating role:', roleError);
        toast.error('Errore nella creazione del ruolo: ' + roleError.message);
      } else {
        console.log('Role created successfully:', roleData);
        toast.success('Super admin creato con successo! Puoi ora effettuare il login. (Nota: potresti dover confermare l\'email se richiesto)');
      }
    } catch (err) {
      console.error('Error in role assignment:', err);
      toast.error('Errore nell\'assegnazione del ruolo');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Setup Super Admin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showEmailWarning && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Se riscontri problemi con domini personalizzati, prova con un indirizzo Gmail (@gmail.com) per evitare limiti di email.
            </AlertDescription>
          </Alert>
        )}
        
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
          onClick={createSuperAdmin} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creazione in corso...' : 'Crea Super Admin'}
        </Button>
        
        <div className="text-sm text-gray-600 mt-4">
          <p><strong>Suggerimento:</strong> Se continui ad avere problemi con il dominio @spiralapp.it, prova con un indirizzo Gmail temporaneo per testare la funzionalità.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuperAdminSetup;
