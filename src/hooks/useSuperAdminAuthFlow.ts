
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

      // Generiamo il codice OTP simulato (modalità test)
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
      console.log('🔍 Verifica codice OTP completata con successo per:', email);

      // Creiamo una vera sessione Supabase usando signInWithPassword con credenziali temporanee
      // Per i Super Admin, creiamo un utente temporaneo se non esiste
      const tempPassword = 'SuperAdmin123!'; // Password temporanea per SuperAdmin
      
      // Prima proviamo il login
      let authResult = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: tempPassword
      });

      // Se il login fallisce, creiamo l'account
      if (authResult.error) {
        console.log('👤 Creazione account SuperAdmin temporaneo...');
        authResult = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password: tempPassword,
          options: {
            data: {
              user_type: 'super_admin',
              is_super_admin: true
            }
          }
        });
      }

      if (authResult.error) {
        console.error('❌ Errore autenticazione:', authResult.error);
        throw authResult.error;
      }

      const user = authResult.data.user;
      if (!user) {
        throw new Error('Nessun utente restituito dall\'autenticazione');
      }

      console.log('👤 Sessione SuperAdmin creata:', user.email);

      // Aggiorniamo il record super_admin
      const { error: updateError } = await supabase
        .from('super_admins')
        .update({ 
          user_id: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('email', email.toLowerCase());

      if (updateError) {
        console.warn('⚠️ Errore aggiornamento super_admin:', updateError);
      }

      // Creiamo la sessione SuperAdmin
      const { error: sessionError } = await supabase
        .from('super_admin_sessions')
        .insert({
          user_id: user.id,
          ip_address: '127.0.0.1',
          user_agent: navigator.userAgent || 'Unknown'
        });

      if (sessionError) {
        console.warn('⚠️ Errore creazione sessione SuperAdmin:', sessionError);
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
