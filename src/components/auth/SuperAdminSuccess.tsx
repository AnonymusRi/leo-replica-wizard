
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Shield, Database } from 'lucide-react';

interface SuperAdminSuccessProps {
  formData: {
    email: string;
    password: string;
  };
  debugInfo: string[];
  onCreateAnother: () => void;
}

const SuperAdminSuccess = ({ formData, debugInfo, onCreateAnother }: SuperAdminSuccessProps) => {
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
          onClick={onCreateAnother}
          variant="outline" 
          className="w-full"
        >
          Crea un altro Super Admin
        </Button>
      </CardContent>
    </Card>
  );
};

export default SuperAdminSuccess;
