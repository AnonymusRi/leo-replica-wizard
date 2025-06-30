
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Phone, Lock, AlertCircle } from 'lucide-react';

interface OTPStepProps {
  phoneNumber: string;
  otpCode: string;
  setOtpCode: (code: string) => void;
  onVerify: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const OTPStep = ({ phoneNumber, otpCode, setOtpCode, onVerify, onBack, isLoading }: OTPStepProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Phone className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-600">
            Codice inviato a {phoneNumber}
          </span>
        </div>
        <Badge variant="outline" className="mb-4">
          <Lock className="w-3 h-3 mr-1" />
          Verifica a 2 Fattori Attiva
        </Badge>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2 text-center">
          Inserisci il codice OTP (6 cifre)
        </label>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={(value) => setOtpCode(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      <div className="space-y-2">
        <Button 
          onClick={onVerify} 
          disabled={isLoading || otpCode.length !== 6}
          className="w-full"
        >
          {isLoading ? 'Verifica in corso...' : 'Verifica Codice'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-full"
        >
          Torna Indietro
        </Button>
      </div>

      <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
        <AlertCircle className="w-3 h-3" />
        <span>Il codice scade tra 10 minuti</span>
      </div>
    </div>
  );
};
