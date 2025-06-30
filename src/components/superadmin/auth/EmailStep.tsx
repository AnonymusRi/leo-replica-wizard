
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const EmailStep = ({ email, setEmail, onSubmit, isLoading }: EmailStepProps) => {
  return (
    <>
      <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
        <Shield className="w-6 h-6 text-white" />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email SuperAdmin</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="riccardo.cirulli@gmail.com"
            required
            className="w-full"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Verifica in corso...' : 'Invia Codice OTP'}
        </Button>
      </form>
    </>
  );
};
