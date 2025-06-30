
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Phone, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SuperAdminAuthProps {
  onAuthenticated: () => void;
}

export const SuperAdminAuth = ({ onAuthenticated }: SuperAdminAuthProps) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Verifica se l'email è un SuperAdmin
      const { data: superAdmin, error: checkError } = await supabase
        .from('super_admins')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (checkError || !superAdmin) {
        toast({
          title: "Accesso Negato",
          description: "Email non autorizzata per l'accesso SuperAdmin.",
          variant: "destructive"
        });
        return;
      }

      // Autentica con Supabase
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'temp-password' // Verrà sostituito con sistema più sicuro
      });

      if (signInError) {
        // Se l'utente non esiste, crealo
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password: 'SuperAdmin123!',
          options: {
            emailRedirectTo: `${window.location.origin}/superadmin`
          }
        });

        if (signUpError) {
          toast({
            title: "Errore Autenticazione",
            description: signUpError.message,
            variant: "destructive"
          });
          return;
        }
      }

      // Genera e invia OTP
      const otpCodeGenerated = Math.floor(100000 + Math.random() * 900000).toString();
      
      const { error: otpError } = await supabase
        .from('otp_codes')
        .insert({
          phone_number: superAdmin.phone_number,
          code: otpCodeGenerated,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minuti
        });

      if (otpError) {
        console.error('Errore inserimento OTP:', otpError);
      }

      setPhoneNumber(superAdmin.phone_number);
      setStep('otp');
      
      // Simula invio SMS (in produzione usare servizio SMS reale)
      console.log(`OTP Code: ${otpCodeGenerated} inviato a ${superAdmin.phone_number}`);
      
      toast({
        title: "Codice OTP Inviato",
        description: `Codice di verifica inviato al numero ${superAdmin.phone_number}`,
      });

    } catch (error) {
      console.error('Errore:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'autenticazione.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (otpCode.length !== 6) {
      toast({
        title: "Codice Incompleto",
        description: "Inserire tutti i 6 numeri del codice OTP.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Verifica OTP
      const { data: otpRecord, error: otpError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('code', otpCode)
        .eq('phone_number', phoneNumber)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (otpError || !otpRecord) {
        toast({
          title: "Codice Non Valido",
          description: "Il codice OTP non è valido o è scaduto.",
          variant: "destructive"
        });
        return;
      }

      // Marca OTP come verificato
      await supabase
        .from('otp_codes')
        .update({ verified: true })
        .eq('id', otpRecord.id);

      // Crea sessione SuperAdmin
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        await supabase
          .from('super_admin_sessions')
          .insert({
            user_id: user.user.id,
            ip_address: '127.0.0.1', // In produzione ottenere IP reale
            user_agent: navigator.userAgent
          });
      }

      toast({
        title: "Accesso Autorizzato",
        description: "Benvenuto nell'area SuperAdmin!",
      });

      onAuthenticated();

    } catch (error) {
      console.error('Errore verifica OTP:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la verifica.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">SuperAdmin Access</CardTitle>
          <CardDescription>
            Accesso riservato agli amministratori di sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
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
          ) : (
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
                  onClick={handleOtpVerify} 
                  disabled={isLoading || otpCode.length !== 6}
                  className="w-full"
                >
                  {isLoading ? 'Verifica in corso...' : 'Verifica Codice'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setStep('email')}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
