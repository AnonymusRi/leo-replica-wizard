# Guida per Configurare Git e il Repository GitHub

## Situazione Attuale

✅ **Il tuo repository è già configurato!**
- **Cartella del progetto**: `C:\Users\Riccardo\leo-replica-wizard`
- **Repository GitHub**: `https://github.com/AnonymusRi/leo-replica-wizard.git`
- **Branch principale**: `main`

## Passo 1: Installare Git

Git non è attualmente installato sul tuo sistema. Ecco come installarlo:

### Opzione A: Download da GitHub (Consigliato)
1. Vai su: https://git-scm.com/download/win
2. Scarica l'installer per Windows
3. Esegui l'installer e segui le istruzioni (usa le impostazioni predefinite)
4. **Importante**: Assicurati che l'opzione "Add Git to PATH" sia selezionata durante l'installazione

### Opzione B: Usando winget (se disponibile)
```powershell
winget install --id Git.Git -e --source winget
```

## Passo 2: Configurare Git (dopo l'installazione)

Dopo aver installato Git, apri PowerShell e configura il tuo nome e email:

```powershell
git config --global user.name "Il Tuo Nome"
git config --global user.email "tua.email@example.com"
```

## Passo 3: Verificare la Configurazione del Repository

Il tuo repository è già configurato correttamente! Per verificare:

```powershell
cd C:\Users\Riccardo\leo-replica-wizard
git remote -v
```

Dovresti vedere:
```
origin  https://github.com/AnonymusRi/leo-replica-wizard.git (fetch)
origin  https://github.com/AnonymusRi/leo-replica-wizard.git (push)
```

## Passo 4: Operazioni Git di Base

### Controllare lo stato del repository:
```powershell
git status
```

### Aggiungere file modificati:
```powershell
git add .
# oppure per file specifici:
git add nome-file.txt
```

### Fare un commit:
```powershell
git commit -m "Descrizione delle modifiche"
```

### Inviare le modifiche a GitHub:
```powershell
git push origin main
```

### Scaricare le modifiche da GitHub:
```powershell
git pull origin main
```

## Passo 5: Autenticazione GitHub

Quando fai `git push` per la prima volta, GitHub ti chiederà di autenticarti. Hai due opzioni:

### Opzione A: Personal Access Token (Consigliato)
1. Vai su: https://github.com/settings/tokens
2. Clicca "Generate new token (classic)"
3. Seleziona gli scope: `repo` (per accesso completo ai repository)
4. Copia il token generato
5. Quando Git ti chiede la password, usa il token invece della password

### Opzione B: GitHub CLI
Installa GitHub CLI e autenticati:
```powershell
winget install --id GitHub.cli
gh auth login
```

## Risoluzione Problemi

### Se Git non viene riconosciuto dopo l'installazione:
1. Chiudi e riapri PowerShell
2. Verifica che Git sia nel PATH: `$env:PATH`
3. Se necessario, aggiungi manualmente: `C:\Program Files\Git\bin`

### Se hai problemi con l'autenticazione:
- Assicurati di usare un Personal Access Token, non la password
- Verifica che il token abbia i permessi `repo`

## Comandi Utili

```powershell
# Vedere la cronologia dei commit
git log

# Vedere le differenze rispetto all'ultimo commit
git diff

# Creare un nuovo branch
git checkout -b nome-nuovo-branch

# Cambiare branch
git checkout nome-branch

# Vedere tutti i branch
git branch -a
```

---

**Nota**: Il link che hai condiviso (`https://github.com/settings/installations/68279431`) è una pagina di configurazione delle app installate su GitHub, non il repository stesso. Il tuo repository è: `https://github.com/AnonymusRi/leo-replica-wizard`

