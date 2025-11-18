# 📝 Istruzioni per Commit e Push

## 🚀 Metodo Rapido (Doppio Click)

1. **Fai doppio click** su `commit-and-push.bat`
2. Lo script eseguirà automaticamente:
   - `git add .`
   - `git commit`
   - `git push origin main`

## 💻 Metodo Manuale (Git Bash o Terminal)

Se hai Git Bash o Git installato nel PATH:

```bash
cd C:\Users\Riccardo\leo-replica-wizard

# Aggiungi tutti i file
git add .

# Commit
git commit -m "Migrate from Supabase to PostgreSQL - Ready for Railway deployment

- Add complete PostgreSQL database schema
- Replace Supabase with PostgreSQL client wrapper
- Add Railway configuration files
- Add database setup script
- Update documentation
- Maintain backward compatibility"

# Push su GitHub
git push origin main
```

## 🔧 Metodo PowerShell

Apri PowerShell nella directory del progetto e esegui:

```powershell
cd C:\Users\Riccardo\leo-replica-wizard
.\commit-and-push.ps1
```

Se ricevi un errore di esecuzione policy, esegui prima:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## ⚠️ Se Git non è installato

1. Scarica Git da: https://git-scm.com/download/win
2. Installa Git
3. Riavvia il terminale
4. Esegui di nuovo lo script

## 🔐 Autenticazione GitHub

Se è la prima volta che fai push, potresti dover autenticarti:

### Opzione 1: Personal Access Token
1. Vai su GitHub → Settings → Developer settings → Personal access tokens
2. Crea un nuovo token con permessi `repo`
3. Usa il token come password quando richiesto

### Opzione 2: GitHub CLI
```bash
gh auth login
```

### Opzione 3: SSH Keys
Configura SSH keys per GitHub (più sicuro per uso continuo)

## ✅ Verifica

Dopo il push, verifica su GitHub:
- Vai su https://github.com/AnonymusRi/leo-replica-wizard
- Controlla che tutti i file siano presenti
- Verifica l'ultimo commit

## 🚂 Dopo il Push

Una volta pushato su GitHub:

1. Vai su https://railway.app
2. Crea nuovo progetto
3. Seleziona "Deploy from GitHub repo"
4. Scegli `leo-replica-wizard`
5. Railway farà il deploy automaticamente!

Vedi `QUICK_START.md` per i dettagli completi.

