# 🚀 Istruzioni Rapide - Commit e Push

## ✅ Hai già installato Git e hai il token - Perfetto!

### Metodo 1: Git Bash (CONSIGLIATO)

1. **Apri Git Bash:**
   - Vai nella cartella `C:\Users\Riccardo\leo-replica-wizard`
   - Clic destro → **"Git Bash Here"**

2. **Esegui questi comandi:**

```bash
# Aggiungi tutti i file
git add .

# Crea il commit
git commit -m "Migrate from Supabase to PostgreSQL - Ready for Railway deployment" -m "- Add complete PostgreSQL database schema" -m "- Replace Supabase with PostgreSQL client wrapper" -m "- Add Railway configuration files" -m "- Add database setup script" -m "- Update documentation" -m "- Maintain backward compatibility"

# Push con il tuo token
git push https://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@github.com/AnonymusRi/leo-replica-wizard.git main
```

### Metodo 2: GitHub Desktop

1. Apri **GitHub Desktop**
2. **File** → **Add Local Repository**
3. Scegli la cartella: `C:\Users\Riccardo\leo-replica-wizard`
4. Se non è una repo, GitHub Desktop chiederà di inizializzarla
5. Scrivi il messaggio di commit nella parte in basso
6. Clicca **"Commit to main"**
7. Clicca **"Push origin"** (in alto)
8. Quando chiede autenticazione, usa il token come password

### Metodo 3: VS Code

1. Apri **VS Code** nella cartella del progetto
2. Vai su **Source Control** (icona a sinistra)
3. Clicca **"+"** accanto ai file modificati
4. Scrivi il messaggio di commit
5. Clicca il **checkmark** per commit
6. Clicca **"..."** → **"Push"**
7. Quando chiede autenticazione:
   - Username: il tuo username GitHub
   - Password: il token `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`

### Metodo 4: Script Batch

1. Fai **doppio click** su `commit-with-token.bat`
2. Lo script farà tutto automaticamente

**NOTA:** Potrebbe essere necessario riavviare il terminale dopo l'installazione di Git.

## 🔐 Configurare Git (Prima volta)

Se è la prima volta che usi Git, configura nome e email:

```bash
git config --global user.name "Il Tuo Nome"
git config --global user.email "tua-email@example.com"
```

## ✅ Verifica

Dopo il push, verifica su GitHub:
- Vai su: https://github.com/AnonymusRi/leo-replica-wizard
- Dovresti vedere tutti i nuovi file
- Controlla l'ultimo commit

## 🚂 Dopo il Push - Collegare Railway

1. Vai su **https://railway.app**
2. Clicca **"New Project"**
3. Seleziona **"Deploy from GitHub repo"**
4. Autorizza Railway
5. Scegli `leo-replica-wizard`
6. Railway farà il deploy automaticamente!

Vedi `QUICK_START.md` per i dettagli completi.

## ⚠️ Problemi Comuni

### "Git non è riconosciuto"
- Riavvia il terminale dopo l'installazione
- Oppure usa Git Bash invece di PowerShell/CMD

### "Permission denied"
- Verifica che il token abbia i permessi `repo`
- Controlla che il token non sia scaduto

### "Repository not found"
- Verifica che la repository esista su GitHub
- Controlla che il nome sia corretto: `AnonymusRi/leo-replica-wizard`

