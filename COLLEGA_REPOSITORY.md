# 🔗 Collegare Repository a Cursor

## ✅ Metodo Rapido (Doppio Click)

**Fai doppio click su:** `setup-git-remote.bat`

Lo script configurerà automaticamente:
- Repository Git (se non esiste)
- Remote origin collegato a GitHub
- Branch main configurato

## 💻 Metodo Manuale (Git Bash)

1. **Apri Git Bash** nella cartella del progetto
2. **Esegui questi comandi:**

```bash
cd /c/Users/Riccardo/leo-replica-wizard

# Inizializza git se non esiste
git init

# Aggiungi remote origin
git remote add origin https://github.com/AnonymusRi/leo-replica-wizard.git

# Oppure se esiste già, aggiornalo:
git remote set-url origin https://github.com/AnonymusRi/leo-replica-wizard.git

# Verifica
git remote -v
```

## 🔧 Configurazione Cursor

Dopo aver configurato Git:

1. **Riavvia Cursor** (se è già aperto)
2. Cursor dovrebbe **rilevare automaticamente** la repository Git
3. Vedrai l'icona Git nella barra laterale
4. Potrai vedere:
   - File modificati
   - Storia commit
   - Branch attivo
   - Diff delle modifiche

## 📝 Verifica

Per verificare che tutto sia collegato:

```bash
# Verifica remote
git remote -v

# Dovresti vedere:
# origin  https://github.com/AnonymusRi/leo-replica-wizard.git (fetch)
# origin  https://github.com/AnonymusRi/leo-replica-wizard.git (push)
```

## 🚀 Primo Commit e Push

Dopo aver collegato la repository:

```bash
# Aggiungi tutti i file
git add .

# Commit
git commit -m "Initial commit: Migrate from Supabase to PostgreSQL"

# Push (con token)
git push https://YOUR_GITHUB_TOKEN@github.com/AnonymusRi/leo-replica-wizard.git main
```

## 🎯 Funzionalità Cursor con Git

Una volta collegato, in Cursor potrai:

- ✅ Vedere i file modificati nella Source Control
- ✅ Fare commit direttamente da Cursor
- ✅ Vedere il diff delle modifiche
- ✅ Gestire branch
- ✅ Vedere la storia dei commit
- ✅ Fare push/pull

## ⚠️ Se Cursor non rileva Git

1. **Riavvia Cursor**
2. **Apri la cartella** come workspace:
   - File → Open Folder
   - Seleziona `C:\Users\Riccardo\leo-replica-wizard`
3. **Verifica** che `.git` esista nella cartella
4. **Controlla** Source Control panel (icona Git a sinistra)

## 📚 Comandi Utili

```bash
# Status repository
git status

# Vedi branch
git branch

# Cambia branch
git checkout main

# Pull da GitHub
git pull origin main

# Push su GitHub
git push origin main
```

