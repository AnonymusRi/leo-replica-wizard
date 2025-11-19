# 🔑 Configurazione Token GitHub per Railway

## 📋 Come Creare un Token GitHub

### Passo 1: Crea il Token su GitHub

1. Vai su **GitHub.com** → Il tuo profilo (in alto a destra) → **Settings**
2. Vai su **Developer settings** (in fondo alla sidebar sinistra)
3. Clicca su **Personal access tokens** → **Tokens (classic)**
4. Clicca su **Generate new token** → **Generate new token (classic)**
5. Dai un nome al token (es: `Railway-Deploy-Token`)
6. Seleziona la scadenza (consigliato: **No expiration** o **90 days**)
7. Seleziona gli scope necessari:
   - ✅ `repo` (Full control of private repositories) - **OBBLIGATORIO**
   - ✅ `read:packages` (se usi GitHub Packages)
8. Clicca su **Generate token**
9. **COPIA IL TOKEN IMMEDIATAMENTE** - non potrai più vederlo!

### Passo 2: Aggiungi il Token in Railway

1. Vai su **Railway Dashboard** → Il tuo progetto → **Servizio Application**
2. Vai su **Settings** → **Source**
3. Se vedi "Source Repo", clicca su **Disconnect**
4. Clicca su **Connect Repo** o **Add Source**
5. Seleziona **GitHub**
6. Se richiesto, inserisci il token GitHub che hai appena creato
7. Seleziona il repository: `AnonymusRi/leo-replica-wizard`
8. Seleziona il branch: `main`
9. Conferma

## 🔍 Verifica

Dopo aver configurato il token:

1. Vai su **Railway Dashboard** → Il tuo progetto → **Servizio Application**
2. Vai su **Settings** → **Source**
3. Dovresti vedere:
   - **Source**: GitHub
   - **Repository**: `AnonymusRi/leo-replica-wizard`
   - **Branch**: `main`

## ⚠️ Importante

- **NON condividere mai il token** con nessuno
- Se il token viene compromesso, revocalo immediatamente su GitHub
- Il token deve avere almeno lo scope `repo` per funzionare

## 🐛 Se il Token Non Funziona

1. Verifica che il token abbia lo scope `repo`
2. Verifica che il token non sia scaduto
3. Prova a rigenerare il token
4. Verifica che il repository sia accessibile con quel token

## 📝 Note

- Railway userà automaticamente il Dockerfile se presente
- Il Dockerfile deve essere nella root del repository
- Railway rileva automaticamente il Dockerfile e lo usa per il build

