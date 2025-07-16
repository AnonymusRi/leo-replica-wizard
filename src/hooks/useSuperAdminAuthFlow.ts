
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSuperAdminAuthFlow = (onAuthenticated: () => void) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('🔐 Inizio processo autenticazione SuperAdmin per:', email);
      
      const emailLower = email.toLowerCase();
      
      // Verifichiamo se l'email è un SuperAdmin
      const { data: superAdminCheck, error: checkError } = await supabase
        .from('super_admins')
        .select('email, phone_number, is_active, two_factor_enabled')
        .eq('email', emailLower)
        .maybeSingle();

      console.log('📧 Verifica SuperAdmin:', { superAdminCheck, checkError });

      if (checkError) {
        console.error('❌ Errore nella verifica SuperAdmin:', checkError);
        toast({
          title: "❌ Errore di Sistema",
          description: "Errore nella verifica delle credenziali. Riprova più tardi.",
          variant: "destructive"
        });
        return;
      }

      if (!superAdminCheck) {
        console.log('⚠️ Email non trovata nella tabella super_admins');
        toast({
          title: "❌ Accesso Negato",
          description: "Email non autorizzata per l'accesso SuperAdmin.",
          variant: "destructive"
        });
        return;
      }

      if (!superAdminCheck.is_active) {
        console.log('🚫 Account SuperAdmin non attivo');
        toast({
          title: "❌ Account Non Attivo",
          description: "Il tuo account SuperAdmin è stato disabilitato.",
          variant: "destructive"
        });
        return;
      }

      // Genera un OTP di test per il bypass temporaneo
      const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(testOtp);

      setPhoneNumber(superAdminCheck.phone_number || '+39 123 456 7890');
      setStep('otp');
      
      toast({
        title: "📧 OTP Generato (MODALITÀ TEST)",
        description: `Codice OTP di test: ${testOtp}`,
        duration: 15000
      });
      
      console.log('🎯 OTP di test generato:', testOtp);

    } catch (error) {
      console.error('💥 Errore critico nel processo di autenticazione:', error);
      toast({
        title: "❌ Errore Critico",
        description: "Si è verificato un errore imprevisto. Riprova.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (otpCode.length !== 6) {
      toast({
        title: "⚠️ Codice Incompleto",
        description: "Inserisci tutte le 6 cifre del codice OTP.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔍 Verifica codice OTP per:', email);

      // Verifica se il codice OTP è corretto (modalità test)
      if (otpCode !== generatedOtp) {
        console.error('❌ Codice OTP non corretto');
        toast({
          title: "❌ Codice Non Valido",
          description: "Il codice OTP inserito non è corretto. Riprova.",
          variant: "destructive"
        });
        return;
      }

      // Crea o autentica l'utente SuperAdmin
      const emailLower = email.toLowerCase();
      
      // Prima prova ad accedere con l'utente esistente
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailLower,
        password: 'superadmin_temp_password_2024'
      });

      if (signInError && signInError.message === 'Invalid login credentials') {
        console.log('🔄 Utente non trovato, creazione nuovo account...');
        
        // Se l'utente non esiste, crealo
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: emailLower,
          password: 'superadmin_temp_password_2024',
          options: {
            emailRedirectTo: window.location.origin + '/superadmin',
            data: {
              role: 'super_admin'
            }
          }
        });

        if (signUpError) {
          console.error('❌ Errore nella creazione account:', signUpError);
          toast({
            title: "❌ Errore Creazione Account",
            description: `Impossibile creare l'account: ${signUpError.message}`,
            variant: "destructive"
          });
          return;
        }

        console.log('✅ Account SuperAdmin creato:', signUpData.user?.email);
      } else if (signInError) {
        console.error('❌ Errore nel login:', signInError);
        toast({
          title: "❌ Errore Login",
          description: `Errore durante il login: ${signInError.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Autenticazione SuperAdmin completata');
      
      toast({
        title: "✅ Accesso Autorizzato",
        description: "Benvenuto nel pannello SuperAdmin!",
      });

      // Chiamiamo il callback di autenticazione completata
      onAuthenticated();
      
    } catch (error) {
      console.error('💥 Errore critico nella verifica OTP:', error);
      toast({
        title: "❌ Errore Critico",
        description: `Errore durante la verifica: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
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
