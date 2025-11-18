
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmailStep } from './auth/EmailStep';
import { OTPStep } from './auth/OTPStep';
import { useSuperAdminAuthFlow } from '@/hooks/useSuperAdminAuthFlow';

interface SuperAdminAuthProps {
  onAuthenticated: () => void;
}

export const SuperAdminAuth = ({ onAuthenticated }: SuperAdminAuthProps) => {
  const {
    step,
    setStep,
    email,
    setEmail,
    otpCode,
    setOtpCode,
    isLoading,
    phoneNumber,
    handleEmailSubmit,
    handleOtpVerify
  } = useSuperAdminAuthFlow(onAuthenticated);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">SuperAdmin Access</CardTitle>
          <CardDescription>
            Accesso riservato agli amministratori di sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' ? (
            <EmailStep
              email={email}
              setEmail={setEmail}
              onSubmit={handleEmailSubmit}
              isLoading={isLoading}
            />
          ) : (
            <OTPStep
              phoneNumber={phoneNumber}
              otpCode={otpCode}
              setOtpCode={setOtpCode}
              onVerify={handleOtpVerify}
              onBack={() => setStep('email')}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
