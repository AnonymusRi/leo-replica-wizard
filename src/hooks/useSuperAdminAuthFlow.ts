
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
      console.log('Verifica SuperAdmin per email:', email);
      
      // Verifica se l'email è un SuperAdmin
      const { data: superAdmin, error: checkError } = await supabase
        .from('super_admins')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

      console.log('Risultato verifica SuperAdmin:', { superAdmin, checkError });

      if (checkError || !superAdmin) {
        toast({
          title: "Accesso Negato",
          description: "Email non autorizzata per l'accesso SuperAdmin.",
          variant: "destructive"
        });
        return;
      }

      // Prova prima a fare il login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: 'SuperAdmin123!'
      });

      // Se l'utente non esiste, crealo
      if (signInError && signInError.message.includes('Invalid login credentials')) {
        console.log('Utente non esistente, creazione in corso...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password: 'SuperAdmin123!',
          options: {
            emailRedirectTo: `${window.location.origin}/superadmin`
          }
        });

        if (signUpError) {
          console.error('Errore nella registrazione:', signUpError);
          toast({
            title: "Errore Autenticazione",
            description: signUpError.message,
            variant: "destructive"
          });
          return;
        }

        console.log('Utente creato:', signUpData);
      } else if (signInError) {
        console.error('Errore nel login:', signInError);
        toast({
          title: "Errore Autenticazione",
          description: signInError.message,
          variant: "destructive"
        });
        return;
      }

      // Genera e invia OTP
      const otpCodeGenerated = Math.floor(100000 + Math.random() * 900000).toString();
      
      console.log('Generazione OTP per telefono:', superAdmin.phone_number);
      
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
        description: `Codice di verifica inviato al numero ${superAdmin.phone_number.replace(/(\+\d{2})(\d{3})(\d{3})(\d+)/, '$1 $2 $3 $4')}`,
      });

    } catch (error) {
      console.error('Errore nel processo di autenticazione:', error);
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
      console.log('Verifica OTP:', { otpCode, phoneNumber });
      
      // Verifica OTP
      const { data: otpRecord, error: otpError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('code', otpCode)
        .eq('phone_number', phoneNumber)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      console.log('Risultato verifica OTP:', { otpRecord, otpError });

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
        console.log('Creazione sessione SuperAdmin per utente:', user.user.id);
        
        const { error: sessionError } = await supabase
          .from('super_admin_sessions')
          .insert({
            user_id: user.user.id,
            ip_address: '127.0.0.1', // In produzione ottenere IP reale
            user_agent: navigator.userAgent
          });

        if (sessionError) {
          console.error('Errore creazione sessione:', sessionError);
        }

        // Aggiorna il record super_admin con user_id se necessario
        await supabase
          .from('super_admins')
          .update({ user_id: user.user.id })
          .eq('email', email.toLowerCase());
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
