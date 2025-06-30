
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSuperAdminAuthFlow = (onAuthenticated: () => void) => {
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

  return {
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
  };
};
