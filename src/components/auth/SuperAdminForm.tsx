
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Shield, Database, AlertTriangle } from 'lucide-react';

interface SuperAdminFormProps {
  formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  onFormDataChange: (updates: Partial<SuperAdminFormProps['formData']>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  debugInfo: string[];
}

const SuperAdminForm = ({ 
  formData, 
  onFormDataChange, 
  onSubmit, 
  isLoading, 
  debugInfo 
}: SuperAdminFormProps) => {
  const hasRateLimit = debugInfo.some(info => 
    info.includes('rate limit') || info.includes('Rate limit')
  );

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

        {hasRateLimit && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Rate limit email raggiunto!</strong><br />
              Soluzioni possibili:<br />
              • Aspetta 10-15 minuti prima di riprovare<br />
              • Disabilita "Email confirmations" in Supabase → Auth → Settings<br />
              • Prova con un'email diversa
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onFormDataChange({ email: e.target.value })}
            placeholder="admin@gmail.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => onFormDataChange({ password: e.target.value })}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nome</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => onFormDataChange({ firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Cognome</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => onFormDataChange({ lastName: e.target.value })}
            />
          </div>
        </div>
        
        <Button 
          onClick={onSubmit} 
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

export default SuperAdminForm;
