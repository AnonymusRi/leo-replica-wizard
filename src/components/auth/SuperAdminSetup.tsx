
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const SuperAdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'superadmin@example.com',
    password: 'SuperAdmin123!',
    firstName: 'Super',
    lastName: 'Admin'
  });

  const createSuperAdmin = async () => {
    setIsLoading(true);
    try {
      console.log('Attempting to create super admin with email:', formData.email);
      
      // First, sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error('Errore durante la registrazione: ' + error.message);
        return;
      }

      if (data.user) {
        console.log('Super admin creato con successo:', data.user.id);
        
        // Wait a bit for the profile to be created by the trigger
        setTimeout(async () => {
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
              .eq('id', data.user.id);

            if (updateError) {
              console.error('Error updating profile:', updateError);
              toast.error('Errore nell\'aggiornamento del profilo: ' + updateError.message);
              return;
            }

            console.log('Profile updated successfully');

            // Use the secure function to create the super admin role
            const { data: roleData, error: roleError } = await supabase
              .rpc('create_user_role', {
                p_user_id: data.user.id,
                p_organization_id: orgData.id,
                p_role: 'super_admin',
                p_module_permissions: ['all']
              });

            if (roleError) {
              console.error('Error creating role:', roleError);
              toast.error('Errore nella creazione del ruolo: ' + roleError.message);
            } else {
              console.log('Role created successfully:', roleData);
              toast.success('Super admin creato con successo! Ora puoi effettuare il login.');
            }
          } catch (err) {
            console.error('Error in post-creation setup:', err);
            toast.error('Errore nella configurazione post-creazione');
          }
        }, 2000);
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

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Setup Super Admin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
      </CardContent>
    </Card>
  );
};

export default SuperAdminSetup;
