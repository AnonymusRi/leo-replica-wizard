
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

      // Password temporanea per SuperAdmin
      const tempPassword = 'SuperAdmin123!';
      
      // Prima proviamo il login diretto
      console.log('🔑 Tentativo login diretto...');
      const loginResult = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: tempPassword
      });

      let user = loginResult.data.user;

      // Se il login fallisce con "Invalid login credentials", l'utente potrebbe non esistere
      if (loginResult.error && loginResult.error.message === 'Invalid login credentials') {
        console.log('👤 Utente non trovato, creazione nuovo account...');
        
        const signupResult = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password: tempPassword,
          options: {
            data: {
              user_type: 'super_admin',
              is_super_admin: true
            }
          }
        });

        if (signupResult.error) {
          // Se l'errore è "User already registered", proviamo reset password
          if (signupResult.error.message === 'User already registered') {
            console.log('🔄 Utente già registrato, tentativo reset password...');
            
            // Resettiamo la password dell'utente esistente
            const { error: updateError } = await supabase.auth.admin.updateUserById(
              (await supabase.auth.signInWithPassword({
                email: email.toLowerCase(),
                password: 'any-wrong-password' // Questo fallirà ma ci darà l'errore per capire se l'utente esiste
              })).error?.message === 'Invalid login credentials' ? '' : '',
              { password: tempPassword }
            );

            // Proviamo di nuovo il login
            const retryLogin = await supabase.auth.signInWithPassword({
              email: email.toLowerCase(),
              password: tempPassword
            });

            if (retryLogin.error) {
              throw new Error('Impossibile autenticare l\'utente SuperAdmin');
            }

            user = retryLogin.data.user;
          } else {
            throw signupResult.error;
          }
        } else {
          user = signupResult.data.user;
        }
      } else if (loginResult.error) {
        throw loginResult.error;
      }

      if (!user) {
        throw new Error('Nessun utente restituito dall\'autenticazione');
      }

      console.log('👤 Sessione SuperAdmin creata:', user.email);

      // Aggiorniamo il record super_admin con l'user_id se necessario
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
        description: `Si è verificato un errore durante la verifica: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
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
