
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSuperAdminAuthFlow = (onAuthenticated: () => void) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [simulatedOtpCode, setSimulatedOtpCode] = useState('');
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

      // Tentiamo di creare o fare login con l'account
      console.log('🔑 Tentativo di autenticazione/creazione account...');
      
      // Prima proviamo a fare login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailLower,
        password: 'SuperAdmin123!'
      });

      if (signInError && signInError.message.includes('Invalid login credentials')) {
        // L'account non esiste, proviamo a crearlo
        console.log('📝 Account non esistente, creazione in corso...');
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: emailLower,
          password: 'SuperAdmin123!',
          options: {
            emailRedirectTo: `${window.location.origin}/superadmin`,
            data: {
              user_type: 'super_admin'
            }
          }
        });

        if (signUpError) {
          console.error('❌ Errore nella creazione account:', signUpError);
          toast({
            title: "❌ Errore di Autenticazione",
            description: `Errore: ${signUpError.message}`,
            variant: "destructive"
          });
          return;
        }
        
        console.log('✅ Account SuperAdmin creato con successo');
      } else if (signInError) {
        console.error('❌ Errore nel login:', signInError);
        toast({
          title: "❌ Errore di Login",
          description: `Errore: ${signInError.message}`,
          variant: "destructive"
        });
        return;
      } else {
        console.log('✅ Login SuperAdmin effettuato con successo');
      }

      // Generiamo il codice OTP simulato
      const generatedOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedOtpCode(generatedOtpCode);
      
      console.log('📱 Codice OTP generato:', generatedOtpCode);
      
      setPhoneNumber(superAdminCheck.phone_number || '+39 123 456 7890');
      setStep('otp');
      
      // Mostriamo il codice OTP nel toast per la modalità test
      toast({
        title: "🔐 Codice OTP (MODALITÀ TEST)",
        description: `Il tuo codice di verifica è: ${generatedOtpCode}`,
        duration: 15000
      });
      
      console.log('🎯 Processo completato, passaggio a step OTP');

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

    // Verifica che il codice OTP sia corretto (modalità simulazione)
    if (otpCode !== simulatedOtpCode) {
      toast({
        title: "❌ Codice Non Valido",
        description: "Il codice OTP inserito non è corretto. Riprova.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔍 Verifica codice OTP completata con successo');

      // Recuperiamo l'utente corrente
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ Errore recupero utente:', userError);
        // Tentiamo di fare login nuovamente
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password: 'SuperAdmin123!'
        });
        
        if (loginError) {
          toast({
            title: "❌ Errore Sessione",
            description: "Impossibile verificare la sessione utente.",
            variant: "destructive"
          });
          return;
        }
      }

      // Recuperiamo nuovamente l'utente dopo il login
      const { data: { user: finalUser } } = await supabase.auth.getUser();
      
      if (finalUser) {
        console.log('👤 Utente autenticato:', finalUser.email);

        // Aggiorniamo il record super_admin con l'user_id
        const { error: updateError } = await supabase
          .from('super_admins')
          .update({ user_id: finalUser.id })
          .eq('email', email.toLowerCase());

        if (updateError) {
          console.warn('⚠️ Errore aggiornamento super_admin:', updateError);
        }

        // Creiamo la sessione SuperAdmin
        const { error: sessionError } = await supabase
          .from('super_admin_sessions')
          .insert({
            user_id: finalUser.id,
            ip_address: '127.0.0.1',
            user_agent: navigator.userAgent || 'Unknown'
          });

        if (sessionError) {
          console.warn('⚠️ Errore creazione sessione SuperAdmin:', sessionError);
        }
      }

      console.log('🎉 Autenticazione SuperAdmin completata con successo!');
      
      toast({
        title: "✅ Accesso Autorizzato",
        description: "Benvenuto nell'area SuperAdmin!",
      });

      // Chiamiamo il callback di autenticazione completata
      onAuthenticated();

    } catch (error) {
      console.error('💥 Errore critico nella verifica OTP:', error);
      toast({
        title: "❌ Errore Critico",
        description: "Si è verificato un errore durante la verifica. Riprova.",
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
    handleOtpVerify,
    simulatedOtpCode
  };
};
