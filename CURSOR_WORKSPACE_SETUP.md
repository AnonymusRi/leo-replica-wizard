# 🚨 IMPORTANTE: Configurazione Workspace Cursor

## ⚠️ PROBLEMA COMUNE

Se vedi solo file `.git` nel file explorer, significa che hai aperto la **cartella sbagliata**!

## ✅ SOLUZIONE

### Come aprire correttamente il progetto in Cursor:

1. **Chiudi Cursor completamente**
2. **Apri Cursor**
3. **File → Open Folder** (o `Ctrl+K Ctrl+O`)
4. **Seleziona questa cartella**: 
   ```
   C:\Users\Riccardo\leo-replica-wizard
   ```
   ⚠️ **NON** selezionare la cartella `.git` dentro!

### Verifica che sia corretto:

Dovresti vedere nella root del progetto:
- ✅ `package.json`
- ✅ `src/`
- ✅ `public/`
- ✅ `server/`
- ✅ `scripts/`
- ✅ `.vscode/` (nuovo)
- ✅ `.git/` (cartella nascosta)

Se vedi solo:
- ❌ `COMMIT_EDITMSG`
- ❌ `config`
- ❌ `HEAD`
- ❌ `objects/`

Allora hai aperto la cartella `.git` invece della root!

## 📁 Struttura Corretta

```
leo-replica-wizard/          ← APRI QUESTA CARTELLA
├── .git/                    ← Cartella nascosta (non aprirla!)
├── .vscode/                 ← Configurazioni Cursor/VSCode
├── node_modules/
├── public/
├── scripts/
├── server/
├── src/
├── package.json
├── vite.config.ts
└── ...
```

## 🔧 Configurazione Automatica

Ho creato i file di configurazione in `.vscode/`:
- `settings.json` - Configurazioni workspace
- `extensions.json` - Estensioni consigliate
- `launch.json` - Configurazioni debug

Queste configurazioni aiuteranno Cursor a riconoscere correttamente il progetto.

## 🎯 Prossimi Passi

1. Apri la cartella corretta in Cursor
2. Installa le estensioni consigliate (Cursor te le suggerirà automaticamente)
3. Il progetto dovrebbe funzionare correttamente!

## 📝 Note

- Il workspace path corretto è: `C:\Users\Riccardo\leo-replica-wizard`
- **NON** usare: `C:\Users\Riccardo\leo-replica-wizard\.git`

