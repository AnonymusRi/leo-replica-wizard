# ALIDAUNIA WeFly

## Manuale Utente Completo

---

## 📋 INDICE

1. [Introduzione](#introduzione)
2. [Accesso al Sistema](#accesso-al-sistema)
3. [Credenziali di Accesso](#credenziali-di-accesso)
4. [Navigazione e Interfaccia](#navigazione-e-interfaccia)
5. [Moduli Disponibili](#moduli-disponibili)
6. [Guida all'Utilizzo dei Moduli](#guida-allutilizzo-dei-moduli)
7. [Potenzialità del Software](#potenzialità-del-software)
8. [Sviluppi Futuri](#sviluppi-futuri)
9. [Supporto e Contatti](#supporto-e-contatti)

---

## 1. INTRODUZIONE

**LEO REPLICA WIZARD** è una piattaforma software completa e integrata per la gestione operativa di compagnie aeree, operatori di volo charter e servizi di elisoccorso. Il sistema è progettato per centralizzare tutte le operazioni aeree in un'unica piattaforma, migliorando l'efficienza operativa, la sicurezza e la conformità normativa.

### Caratteristiche Principali

- **Architettura Multi-Organizzazione**: Supporto per più organizzazioni con isolamento completo dei dati
- **Moduli Specializzati**: 11 moduli integrati per ogni aspetto della gestione aerea
- **Conformità Normativa**: Sistema integrato per il controllo di certificazioni, FTL (Flight Time Limitations) e conformità ENAC
- **Dashboard in Tempo Reale**: Monitoraggio operativo in tempo reale con notifiche automatiche
- **Gestione Avanzata Equipaggio**: Sistema completo per certificazioni, addestramenti, fatica e compliance
- **Simulazione Dati**: Strumento integrato per generare dati di test realistici

---

## 2. ACCESSO AL SISTEMA

### 2.1 Accesso Web

Il software è accessibile tramite browser web all'indirizzo:

```
https://alidaunia-production.up.railway.app
```

### 2.2 Requisiti di Sistema

- **Browser**: Chrome, Firefox, Edge, Safari (versioni recenti)
- **Risoluzione Consigliata**: 1920x1080 o superiore
- **Connessione Internet**: Stabile per operazioni in tempo reale

### 2.3 Primo Accesso

1. Aprire il browser e navigare all'URL del sistema
2. Cliccare sul pulsante **"Accesso"** in alto a destra
3. Inserire le credenziali (vedi sezione 3)
4. Selezionare il tipo di accesso (Amministratore, Operatore, Equipaggio)

---

## 3. CREDENZIALI DI ACCESSO

### 3.1 SuperAdmin (Amministratore Sistema)

**Email**: `riccardo.cirulli@gmail.com`  
**Password**: _(configurata durante il setup iniziale)_

**Permessi**:

- Accesso completo a tutte le funzionalità
- Gestione organizzazioni e licenze
- Configurazione sistema
- Accesso dashboard SuperAdmin

**Accesso**: Navigare a `/superadmin` o utilizzare il link "SuperAdmin" nella pagina di login

---

### 3.2 Account Equipaggio (Crew Members)

Gli account equipaggio vengono creati automaticamente durante la simulazione dati. Ogni membro dell'equipaggio ha:

**Password Standard**: `crew123`

**Email**: Formato `nome.cognome@organizzazione.it`  
Esempi:

- `marco.rossi0@alidaunia.it`
- `giuseppe.bianchi1@elisoccorso-puglia.it`
- `francesco.ferrari2@elisoccorso-campania.it`

**Permessi**:

- Accesso dashboard equipaggio (`/crew-dashboard`)
- Visualizzazione assegnazioni voli
- Visualizzazione certificazioni e addestramenti
- Visualizzazione statistiche personali
- Gestione profilo personale

**Nota**: Per ottenere l'elenco completo degli account equipaggio, utilizzare il modulo ADMIN → Gestione Utenti

---

### 3.3 Account Amministratore Organizzazione

Gli account amministratore possono essere creati dal SuperAdmin o durante la configurazione iniziale dell'organizzazione.

**Permessi**:

- Gestione completa dell'organizzazione
- Accesso a tutti i moduli operativi
- Gestione utenti e permessi
- Configurazione moduli attivi

---

## 4. NAVIGAZIONE E INTERFACCIA

### 4.1 Struttura Principale

L'interfaccia principale è divisa in tre aree:

1. **Header Superiore**: Barra di navigazione con moduli e controlli
2. **Area Contenuto**: Visualizzazione del modulo selezionato
3. **Sidebar** (se presente): Menu contestuale del modulo

### 4.2 Barra di Navigazione Moduli

Nella parte superiore della schermata, troverete 11 icone che rappresentano i moduli disponibili:

| Icona | Modulo          | Descrizione               |
| ----- | --------------- | ------------------------- |
| 📅    | **SCHED**       | Pianificazione Voli       |
| ✈️    | **SALES**       | Vendite e CRM             |
| ⚙️    | **OPS**         | Operazioni di Volo        |
| ✈️    | **AIRCRAFT**    | Gestione Flotta           |
| 👥    | **CREW**        | Gestione Equipaggio       |
| ⏱️    | **CREW-TIME**   | Tempo e Fatica Equipaggio |
| 🔧    | **MX**          | Manutenzione              |
| 📊    | **REPORTS**     | Report e Analisi          |
| 📞    | **PHONEBOOK**   | Rubrica Contatti          |
| 👤    | **OWNER BOARD** | Dashboard Proprietario    |
| 🛡️    | **ADMIN**       | Amministrazione           |

### 4.3 Controlli Header

Nella parte destra dell'header troverete:

- **Badge UTC**: Fuso orario UTC
- **Badge ALIDA SUPPORT**: Supporto tecnico
- **Badge TEST USER**: Utente corrente
- **Pulsante Accesso**: Per login/logout
- **Pulsante Impostazioni**: Configurazioni utente

---

## 5. MODULI DISPONIBILI

### 5.1 SCHED - Pianificazione Voli

**Funzionalità Principali**:

- Creazione e modifica voli
- Gestione multi-leg (voli con più tratte)
- Assegnazione aeromobili e equipaggio
- Visualizzazione calendario settimanale/mensile
- Pubblicazione programmi
- Esportazione programmi (PDF, Excel, iCal)
- Gestione versioni programmi
- Integrazione con sistemi esterni

**Viste Disponibili**:

- **Vista Base**: Tabella semplificata con voli principali
- **Vista Avanzata**: Calendario completo con dettagli operativi

**Accesso**: Cliccare sull'icona 📅 nella barra di navigazione

---

### 5.2 SALES - Vendite e CRM

**Funzionalità Principali**:

- Gestione clienti completa
- Creazione preventivi automatici
- Calcolo prezzi dinamici
- Gestione contratti
- Integrazione fatturazione
- Tracking vendite
- Integrazione marketplace (Avinode)
- Comunicazioni automatizzate
- Gestione checklist vendita

**Sezioni**:

- **Preventivi**: Creazione e gestione preventivi
- **Prenotazioni**: Visualizzazione e gestione prenotazioni
- **Clienti**: Database clienti completo
- **Marketplace**: Integrazione con piattaforme esterne
- **Messaggistica**: Comunicazioni con clienti

**Accesso**: Cliccare sull'icona ✈️ (SALES) nella barra di navigazione

---

### 5.3 OPS - Operazioni di Volo

**Funzionalità Principali**:

- Monitoraggio voli in tempo reale
- Checklist operative personalizzabili
- Gestione richieste handling
- Generazione automatica documenti volo
- Notifiche operative
- Controllo compliance
- Dashboard operazioni
- Assegnazione equipaggio con validazione certificazioni

**Viste Disponibili**:

- **Vista Tabella**: Lista voli con filtri avanzati
- **Vista Calendario**: Visualizzazione temporale
- **Vista Timeline**: Sequenza temporale operazioni

**Accesso**: Cliccare sull'icona ⚙️ nella barra di navigazione

---

### 5.4 AIRCRAFT - Gestione Flotta

**Funzionalità Principali**:

- Database completo aeromobili
- Tracking ore di volo
- Gestione documenti e certificazioni
- Controllo scadenze
- Configurazioni cabina
- Digital Technical Log
- Analisi utilizzo flotta
- Costi operativi

**Sezioni**:

- **Flotta**: Elenco completo aeromobili
- **Documenti**: Gestione certificazioni e documenti
- **Requisiti Licenze**: Configurazione requisiti per tipo aeromobile

**Accesso**: Cliccare sull'icona ✈️ (AIRCRAFT) nella barra di navigazione

---

### 5.5 CREW - Gestione Equipaggio

**Funzionalità Principali**:

- Database completo equipaggio
- Gestione certificazioni
- Controllo scadenze certificazioni
- Gestione addestramenti
- Assegnazione voli
- Statistiche equipaggio
- Gestione profili

**Sezioni**:

- **Equipaggio**: Elenco membri equipaggio
- **Certificazioni**: Gestione certificazioni e scadenze
- **Addestramenti**: Programma addestramenti
- **Statistiche**: Dati operativi equipaggio

**Accesso**: Cliccare sull'icona 👥 nella barra di navigazione

---

### 5.6 CREW-TIME - Tempo e Fatica Equipaggio

**Funzionalità Principali**:

- Monitoraggio ore di servizio (duty hours)
- Monitoraggio ore di volo
- Calcolo tempo di riposo
- Analisi fatica equipaggio
- Controllo FTL (Flight Time Limitations)
- Rilevamento violazioni FTL
- Dashboard fatica individuale
- Report compliance

**Dati Visualizzati**:

- Ore di servizio giornaliere/settimanali/mensili
- Ore di volo per pilota
- Livello fatica (1-10)
- Violazioni FTL
- Tempo di riposo disponibile

**Accesso**: Cliccare sull'icona ⏱️ nella barra di navigazione

---

### 5.7 MX - Manutenzione

**Funzionalità Principali**:

- Gestione record manutenzione
- Programmazione manutenzioni
- Tracking consumo olio
- Gestione documenti tecnici
- Hold items (elementi in attesa)
- Analisi costi manutenzione
- Alert scadenze
- Fleet status overview

**Sezioni**:

- **Overview**: Dashboard manutenzione
- **Flotta**: Dettagli tecnici aeromobili
- **Documenti**: Documentazione tecnica
- **Hold Items**: Elementi in attesa
- **Oil Tracking**: Monitoraggio consumo olio
- **Report**: Report manutenzione

**Funzionalità Speciale**:

- **Simulazione Dati**: Strumento per generare dati di test (voli, manutenzioni, record olio)

**Accesso**: Cliccare sull'icona 🔧 nella barra di navigazione

---

### 5.8 REPORTS - Report e Analisi

**Funzionalità Principali**:

- Report voli
- Report equipaggio
- Report manutenzione
- Analisi utilizzo flotta
- Report finanziari
- Export dati (PDF, Excel, CSV)
- Grafici e visualizzazioni
- Report personalizzati

**Tipi di Report**:

- Report operativi giornalieri/settimanali/mensili
- Report compliance
- Report finanziari
- Report statistici

**Accesso**: Cliccare sull'icona 📊 nella barra di navigazione

---

### 5.9 PHONEBOOK - Rubrica Contatti

**Funzionalità Principali**:

- Database contatti completo
- Ricerca avanzata
- Categorizzazione contatti
- Integrazione con altri moduli
- Export contatti

**Accesso**: Cliccare sull'icona 📞 nella barra di navigazione

---

### 5.10 OWNER BOARD - Dashboard Proprietario

**Funzionalità Principali**:

- Dashboard operativa proprietario
- Overview voli
- Statistiche utilizzo
- Report proprietario
- Visualizzazione dati chiave

**Accesso**: Cliccare sull'icona 👤 nella barra di navigazione

---

### 5.11 ADMIN - Amministrazione

**Funzionalità Principali**:

- Gestione utenti
- Gestione ruoli e permessi
- Gestione organizzazioni
- Configurazione moduli
- Log sistema
- Impostazioni generali

**Sezioni**:

- **Gestione Utenti**: Creazione e modifica utenti
- **Gestione Ruoli**: Configurazione ruoli e permessi
- **Gestione Organizzazioni**: Configurazione organizzazioni

**Accesso**: Cliccare sull'icona 🛡️ nella barra di navigazione

---

## 6. GUIDA ALL'UTILIZZO DEI MODULI

### 6.1 Creazione di un Nuovo Volo

1. Accedere al modulo **SCHED**
2. Cliccare sul pulsante **"Nuovo Volo"** o **"Aggiungi Volo"**
3. Compilare i campi obbligatori:
   - Numero volo
   - Aeroporto partenza
   - Aeroporto arrivo
   - Data e ora partenza
   - Data e ora arrivo
   - Aeromobile
4. (Opzionale) Aggiungere tratte aggiuntive per voli multi-leg
5. Assegnare equipaggio (con validazione automatica certificazioni)
6. Salvare il volo

**Nota**: Il sistema valida automaticamente:

- Disponibilità aeromobile
- Disponibilità equipaggio
- Conformità certificazioni
- Conformità FTL

---

### 6.2 Creazione di un Preventivo

1. Accedere al modulo **SALES**
2. Selezionare la sezione **"Preventivi"**
3. Cliccare su **"Nuovo Preventivo"**
4. Selezionare il cliente (o crearne uno nuovo)
5. Compilare i dettagli volo:
   - Rotta
   - Data/ora
   - Numero passeggeri
   - Servizi richiesti
6. Il sistema calcola automaticamente il prezzo
7. (Opzionale) Applicare sconti o modifiche
8. Inviare preventivo al cliente

---

### 6.3 Monitoraggio Operativo

1. Accedere al modulo **OPS**
2. Selezionare la vista preferita (Tabella/Calendario/Timeline)
3. Utilizzare i filtri per:
   - Data
   - Stato volo
   - Aeromobile
   - Equipaggio
4. Cliccare su un volo per vedere i dettagli completi
5. Utilizzare le azioni rapide:
   - Assegnare equipaggio
   - Generare documenti
   - Completare checklist
   - Aggiornare stato

---

### 6.4 Gestione Certificazioni Equipaggio

1. Accedere al modulo **CREW**
2. Selezionare un membro dell'equipaggio
3. Andare alla sezione **"Certificazioni"**
4. Cliccare su **"Aggiungi Certificazione"**
5. Compilare:
   - Tipo certificazione
   - Numero certificato
   - Data emissione
   - Data scadenza
   - Autorità emittente
6. Salvare

**Nota**: Il sistema invia automaticamente alert quando una certificazione è in scadenza o scaduta.

---

### 6.5 Monitoraggio Fatica Equipaggio

1. Accedere al modulo **CREW-TIME**
2. Selezionare un membro dell'equipaggio
3. Visualizzare:
   - Ore di servizio giornaliere/settimanali
   - Ore di volo
   - Livello fatica (indicatore 1-10)
   - Violazioni FTL
   - Tempo di riposo disponibile
4. Utilizzare i filtri per periodo specifico

**Indicatori Fatica**:

- **1-3**: Bassa (ore servizio < 6h)
- **4-6**: Media (ore servizio 6-10h)
- **7-10**: Alta (ore servizio > 10h)

---

### 6.6 Programmazione Manutenzione

1. Accedere al modulo **MX**
2. Selezionare la sezione **"Manutenzioni"**
3. Cliccare su **"Nuova Manutenzione"**
4. Selezionare l'aeromobile
5. Compilare:
   - Tipo manutenzione
   - Descrizione
   - Data programmata
   - Tecnico assegnato
   - Costo stimato
6. Salvare

**Nota**: Il sistema traccia automaticamente le manutenzioni programmate e invia alert per scadenze.

---

### 6.7 Simulazione Dati di Test

Il sistema include uno strumento integrato per generare dati di test realistici:

1. Accedere al modulo **MX**
2. Nella sezione **"Overview"**, trovare la card **"Simulazione Dati"**
3. Cliccare su **"Avvia Simulazione"**
4. Il sistema genererà automaticamente:
   - 700+ voli (passati, presenti, futuri)
   - Assegnazioni equipaggio
   - Record manutenzione
   - Record consumo olio
   - Certificazioni equipaggio (con vari stati: valide, in scadenza, scadute)
   - Addestramenti programmati
   - Dati crew_time (tempo e fatica)

**Nota**: La simulazione cancella automaticamente i dati esistenti prima di generare nuovi dati.

---

## 7. POTENZIALITÀ DEL SOFTWARE

### 7.1 Architettura Scalabile

**Multi-Organizzazione**:

- Supporto per infinite organizzazioni
- Isolamento completo dei dati
- Configurazione moduli per organizzazione
- Gestione licenze centralizzata

**Performance**:

- Paginazione intelligente per grandi volumi di dati
- Caricamento progressivo (mostra prima i dati più recenti)
- Cache ottimizzata
- Query database ottimizzate

---

### 7.2 Conformità Normativa Avanzata

**Certificazioni**:

- Tracking completo certificazioni equipaggio
- Alert automatici per scadenze
- Validazione certificazioni durante assegnazione voli
- Integrazione con database ENAC

**FTL (Flight Time Limitations)**:

- Calcolo automatico ore di servizio
- Rilevamento violazioni FTL
- Monitoraggio tempo di riposo
- Dashboard compliance

**Documentazione**:

- Generazione automatica documenti volo
- Tracking scadenze documenti
- Archiviazione digitale
- Export documenti

---

### 7.3 Automazione e Integrazione

**Workflow Automatizzati**:

- Generazione automatica preventivi
- Calcolo prezzi dinamici
- Assegnazione automatica equipaggio (con validazione)
- Generazione documenti volo
- Notifiche automatiche

**Integrazioni Esterne**:

- Marketplace (Avinode)
- Sistemi di fatturazione
- Sistemi di prenotazione
- API REST per integrazioni personalizzate

---

### 7.4 Business Intelligence

**Analisi Dati**:

- Report operativi completi
- Analisi utilizzo flotta
- Analisi performance equipaggio
- Analisi costi operativi
- Trend analysis

**Visualizzazioni**:

- Grafici interattivi
- Dashboard personalizzabili
- Export dati multipli formati
- Report schedulati

---

### 7.5 Sicurezza e Affidabilità

**Sicurezza**:

- Autenticazione multi-fattore (opzionale)
- Ruoli e permessi granulari
- Audit log completo
- Crittografia dati sensibili
- Backup automatici

**Affidabilità**:

- Uptime 99.9%
- Ridondanza database
- Failover automatico
- Monitoraggio continuo

---

## 8. SVILUPPI FUTURI

### 8.1 Funzionalità in Sviluppo

**Q1 2025**:

- **App Mobile Equipaggio**: App iOS/Android per accesso mobile equipaggio
- **Integrazione Meteo**: Integrazione dati meteo in tempo reale
- **AI Predictive Maintenance**: Predizione manutenzioni con AI
- **Advanced Analytics**: Dashboard analytics avanzate con machine learning

**Q2 2025**:

- **Blockchain Certificazioni**: Certificazioni su blockchain per immutabilità
- **IoT Integration**: Integrazione sensori aeromobili per telemetria real-time
- **Voice Commands**: Controllo vocale per operazioni
- **Multi-Language**: Supporto lingue aggiuntive (FR, DE, ES)

**Q3 2025**:

- **Virtual Reality Training**: Simulazioni VR per addestramento
- **Advanced Route Optimization**: Ottimizzazione rotte con AI
- **Carbon Footprint Tracking**: Tracking impronta carbonica voli
- **Customer Portal**: Portale clienti self-service

---

### 8.2 Miglioramenti Pianificati

**Usabilità**:

- Interfaccia utente ridisegnata con design system moderno
- Onboarding guidato per nuovi utenti
- Tutorial interattivi
- Shortcuts keyboard avanzati

**Performance**:

- Implementazione caching distribuito
- Ottimizzazione query database
- Lazy loading avanzato
- CDN per asset statici

**Funzionalità**:

- Sistema di ticketing integrato
- Chat in-app per comunicazioni
- Video conferenze integrate
- E-signature per documenti

---

### 8.3 Roadmap Tecnologica

**Infrastruttura**:

- Migrazione a microservizi
- Containerizzazione completa
- Kubernetes orchestration
- Multi-region deployment

**Tecnologie**:

- GraphQL API
- WebSocket per real-time
- Service Workers per offline
- Progressive Web App (PWA)

---

## 9. SUPPORTO E CONTATTI

### 9.1 Supporto Tecnico

**Email**: support@alidaunia.it  
**Telefono**: +39 XXX XXX XXXX  
**Orari**: Lun-Ven 9:00-18:00 CET

### 9.2 Documentazione

- **Manuale Utente**: Questo documento
- **API Documentation**: Disponibile su `/api/docs`
- **Video Tutorials**: Disponibili nella sezione "Guida" del SuperAdmin

### 9.3 Training

Sono disponibili sessioni di training personalizzate:

- Training base (4 ore)
- Training avanzato (8 ore)
- Training amministratori (16 ore)

Contattare il supporto per prenotare una sessione.

---

## 10. APPENDICE: SCREENSHOT E REFERENCE

### 10.1 Flusso Operativo Tipico

1. **Pianificazione** (SCHED): Creazione voli e assegnazione risorse
2. **Vendita** (SALES): Gestione preventivi e prenotazioni
3. **Operazioni** (OPS): Monitoraggio voli in tempo reale
4. **Manutenzione** (MX): Programmazione e tracking manutenzioni
5. **Equipaggio** (CREW/CREW-TIME): Gestione e monitoraggio equipaggio
6. **Report** (REPORTS): Analisi e reportistica

### 10.2 Best Practices

**Sicurezza**:

- Cambiare password regolarmente
- Non condividere credenziali
- Utilizzare autenticazione a due fattori quando disponibile

**Efficienza**:

- Utilizzare filtri per ridurre tempi di ricerca
- Configurare alert personalizzati
- Esportare dati regolarmente per backup

**Compliance**:

- Verificare certificazioni regolarmente
- Monitorare FTL compliance
- Mantenere documentazione aggiornata

---

## CONCLUSIONE

**WeFly** rappresenta una soluzione completa e moderna per la gestione operativa di compagnie aeree e operatori di volo. Con i suoi 11 moduli integrati, conformità normativa avanzata e architettura scalabile, il sistema offre una piattaforma unificata per tutte le esigenze operative.

Il software è in continua evoluzione, con nuove funzionalità e miglioramenti rilasciati regolarmente. Per rimanere aggiornati sulle novità, consultare la sezione "Sviluppi Futuri" o contattare il supporto.

---

**Versione Documento**: 1.6  
**Data Ultimo Aggiornamento**: Novembre 2025  
**Autore**: Team Sviluppo Spiralapp.it

---

_Questo documento è proprietà di Riccardo Cirulli. Tutti i diritti riservati._
