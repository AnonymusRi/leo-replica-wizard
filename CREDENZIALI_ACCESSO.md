# Credenziali di Accesso - Leo Replica Wizard

## 🔐 Credenziali SuperAdmin

**Email**: `riccardo.cirulli@gmail.com`

**OTP (Modalità Test)**: Viene generato automaticamente quando inserisci l'email. Controlla il toast/notifica per il codice OTP di test.

**Password temporanea**: `superadmin_temp_password_2024`

### Come accedere come SuperAdmin:

1. Vai su: `/superadmin`
2. Inserisci l'email: `riccardo.cirulli@gmail.com`
3. Inserisci il codice OTP mostrato nella notifica (modalità test)
4. Verrai autenticato automaticamente

---

## 👥 Credenziali Admin/Utenti

### Admin/Operator
**Email**: `admin@example.com`  
**Password**: `admin123`

### Crew Member
**Email**: `crew@example.com`  
**Password**: `crew123`

### Viewer
**Email**: `viewer@example.com`  
**Password**: `viewer123`

---

## 📝 Nota Importante

⚠️ **ATTENZIONE**: Queste sono credenziali di test/demo. 

L'applicazione attualmente funziona in modalità mock nel browser perché:
- È una SPA (Single Page Application) servita come file statici
- Non può accedere direttamente al database PostgreSQL dal browser
- Il database PostgreSQL funziona solo lato server

### Per usare il database reale:

1. **Crea un backend API** (Node.js/Express) che:
   - Si connette al database PostgreSQL
   - Espone endpoint REST/GraphQL
   - Gestisce l'autenticazione

2. **Modifica il client** per fare chiamate HTTP all'API invece di usare `supabase` direttamente

3. **Oppure** usa Supabase Client SDK che gestisce tutto tramite API

---

## 🚀 Prossimi Passi

1. ✅ Repository GitHub configurato
2. ✅ Database PostgreSQL su Railway
3. ✅ Build e deploy funzionanti
4. ⚠️ **DA FARE**: Creare backend API per il database
5. ⚠️ **DA FARE**: Configurare autenticazione reale
6. ⚠️ **DA FARE**: Popolare database con dati iniziali

---

## 📧 Email SuperAdmin Autorizzate

- `riccardo.cirulli@gmail.com` ✅

Per aggiungere altri SuperAdmin, inserisci i record nella tabella `super_admins` del database PostgreSQL.

