
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { addDays, format, startOfDay, addHours, addMinutes } from 'date-fns';

interface SimulationData {
  flights: any[];
  assignments: any[];
  maintenanceRecords: any[];
  oilRecords: any[];
}

export const useHelicopterSimulation = () => {
  const queryClient = useQueryClient();

  const generateSimulationData = (): SimulationData => {
    const flights: any[] = [];
    const assignments: any[] = [];
    const maintenanceRecords: any[] = [];
    const oilRecords: any[] = [];
    
    // Simuliamo 12 mesi: 6 mesi passati + 6 mesi futuri per avere almeno 700 voli
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    const sixMonthsFromNow = new Date(today);
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    
    const startDate = new Date(sixMonthsAgo);
    startDate.setDate(1); // Primo giorno del mese
    const endDate = new Date(sixMonthsFromNow);
    endDate.setDate(0); // Ultimo giorno del mese precedente
    
    console.log(`📅 Simulazione date: ${format(startDate, 'yyyy-MM-dd')} - ${format(endDate, 'yyyy-MM-dd')}`);
    console.log(`   Oggi: ${format(today, 'yyyy-MM-dd')}`);
    
    // Simuliamo 6 mesi di operazioni (3 passati + 3 futuri)
    for (let date = new Date(startDate); date <= endDate; date = addDays(date, 1)) {
      const dayOfWeek = date.getDay();
      
      // Voli regolari Foggia-Tremiti (tutti i giorni tranne domenica)
      if (dayOfWeek !== 0) {
        // Volo mattutino andata
        const flight1 = {
          id: crypto.randomUUID(),
          flight_number: `TRM${format(date, 'MMdd')}01`,
          departure_airport: 'LIBF',
          arrival_airport: 'LIIT',
          departure_time: format(addHours(startOfDay(date), 8), 'yyyy-MM-dd HH:mm:ss'),
          arrival_time: format(addHours(startOfDay(date), 8.75), 'yyyy-MM-dd HH:mm:ss'),
          passenger_count: Math.floor(Math.random() * 10) + 2,
          status: date < today ? 'completed' : (date.toDateString() === today.toDateString() ? 'active' : 'scheduled'),
          notes: 'Volo regolare trasporto passeggeri'
        };
        
        // Volo mattutino ritorno
        const flight2 = {
          id: crypto.randomUUID(),
          flight_number: `TRM${format(date, 'MMdd')}02`,
          departure_airport: 'LIIT',
          arrival_airport: 'LIBF',
          departure_time: format(addHours(startOfDay(date), 9), 'yyyy-MM-dd HH:mm:ss'),
          arrival_time: format(addHours(startOfDay(date), 9.75), 'yyyy-MM-dd HH:mm:ss'),
          passenger_count: Math.floor(Math.random() * 8) + 1,
          status: date < today ? 'completed' : (date.toDateString() === today.toDateString() ? 'active' : 'scheduled'),
          notes: 'Volo regolare trasporto passeggeri'
        };
        
        // Volo pomeridiano andata
        const flight3 = {
          id: crypto.randomUUID(),
          flight_number: `TRM${format(date, 'MMdd')}03`,
          departure_airport: 'LIBF',
          arrival_airport: 'LIIT',
          departure_time: format(addHours(startOfDay(date), 15), 'yyyy-MM-dd HH:mm:ss'),
          arrival_time: format(addHours(startOfDay(date), 15.75), 'yyyy-MM-dd HH:mm:ss'),
          passenger_count: Math.floor(Math.random() * 12) + 1,
          status: date < today ? 'completed' : (date.toDateString() === today.toDateString() ? 'active' : 'scheduled'),
          notes: 'Volo regolare trasporto passeggeri'
        };
        
        // Volo pomeridiano ritorno
        const flight4 = {
          id: crypto.randomUUID(),
          flight_number: `TRM${format(date, 'MMdd')}04`,
          departure_airport: 'LIIT',
          arrival_airport: 'LIBF',
          departure_time: format(addHours(startOfDay(date), 16), 'yyyy-MM-dd HH:mm:ss'),
          arrival_time: format(addHours(startOfDay(date), 16.75), 'yyyy-MM-dd HH:mm:ss'),
          passenger_count: Math.floor(Math.random() * 10) + 1,
          status: date < today ? 'completed' : (date.toDateString() === today.toDateString() ? 'active' : 'scheduled'),
          notes: 'Volo regolare trasporto passeggeri'
        };
        
        flights.push(flight1, flight2, flight3, flight4);
      }
      
      // Missioni di elisoccorso (casuali, 3-10 al giorno per avere più voli)
      const rescueMissions = Math.floor(Math.random() * 8) + 3;
      for (let i = 0; i < rescueMissions; i++) {
        const startHour = Math.floor(Math.random() * 20) + 4; // 04:00 - 23:59
        const startMinute = Math.floor(Math.random() * 60);
        const duration = Math.floor(Math.random() * 180) + 30; // 30-210 minuti
        
        const regions = ['LIBN', 'LIRN']; // Puglia e Campania
        const region = regions[Math.floor(Math.random() * regions.length)];
        
        const rescueFlight = {
          id: crypto.randomUUID(),
          flight_number: `RESC${format(date, 'MMdd')}${String(i + 1).padStart(2, '0')}`,
          departure_airport: region,
          arrival_airport: region,
          departure_time: format(addMinutes(addHours(startOfDay(date), startHour), startMinute), 'yyyy-MM-dd HH:mm:ss'),
          arrival_time: format(addMinutes(addHours(startOfDay(date), startHour), startMinute + duration), 'yyyy-MM-dd HH:mm:ss'),
          passenger_count: Math.floor(Math.random() * 4) + 1, // Pazienti + medici
          status: date < today ? 'completed' : (date.toDateString() === today.toDateString() ? 'active' : 'scheduled'),
          notes: `Missione elisoccorso ${region === 'LIBN' ? 'Puglia' : 'Campania'}`
        };
        
        flights.push(rescueFlight);
      }
      
      // Manutenzioni programmate (1-2 volte a settimana)
      if (Math.random() < 0.3) {
        const maintenanceRecord = {
          id: crypto.randomUUID(),
          maintenance_type: Math.random() > 0.5 ? '100-hour inspection' : 'routine maintenance',
          description: 'Ispezione programmata elicottero',
          scheduled_date: format(addHours(startOfDay(date), 6), 'yyyy-MM-dd HH:mm:ss'),
          completed_date: date < today ? format(addHours(startOfDay(date), 10), 'yyyy-MM-dd HH:mm:ss') : null,
          status: date < today ? 'completed' : 'scheduled',
          cost: Math.floor(Math.random() * 5000) + 1000,
          notes: 'Manutenzione programmata per garantire sicurezza operativa'
        };
        
        maintenanceRecords.push(maintenanceRecord);
      }
      
      // Registrazioni consumo olio (per alcuni voli)
      // Nota: recorded_by verrà assegnato dopo quando avremo i crew members
      if (Math.random() < 0.4) {
        const engines = ['Engine 1', 'Engine 2'];
        engines.forEach(engine => {
          const oilRecord = {
            id: crypto.randomUUID(),
            engine_position: engine,
            flight_date: format(date, 'yyyy-MM-dd'),
            flight_hours: Math.random() * 8 + 1,
            oil_added_liters: Math.random() * 2,
            oil_level_before: Math.random() * 50 + 50, // 50-100%
            oil_level_after: Math.random() * 50 + 40,  // 40-90%
            consumption_rate: Math.random() * 0.5 + 0.1, // 0.1-0.6 liters/hour (dentro il limite 99.9)
            notes: 'Controllo routine consumo olio',
            recorded_by: null // Verrà assegnato dopo con l'ID di un meccanico
          };
          
          oilRecords.push(oilRecord);
        });
      }
    }
    
    return { flights, assignments, maintenanceRecords, oilRecords };
  };

  return useMutation({
    mutationFn: async () => {
      const today = new Date(); // Dichiarata una sola volta all'inizio
      console.log('Iniziando simulazione dati per 5 mesi...');
      
      // PRIMA: Cancella tutti i dati esistenti (tranne superadmin, organizations, profiles, crew_members)
      console.log('🗑️  Cancellando dati esistenti prima della simulazione...');
      
      // Cancella in ordine inverso rispetto alle dipendenze (prima le tabelle figlie, poi le parenti)
      const tablesToClean = [
        'pilot_flight_hours',
        'pilot_schedule',
        'crew_flight_assignments',
        'crew_statistics',
        'oil_consumption_records',
        'maintenance_records',
        'flights'
      ];
      
      for (const table of tablesToClean) {
        try {
          // Prima otteniamo tutti gli ID, poi li cancelliamo tramite API
          const { data: allRecords, error: selectError } = await supabase
            .from(table)
            .select('id')
            .limit(10000); // Limite ragionevole per evitare timeout
          
          if (selectError) {
            console.warn(`⚠️  Errore selezione ${table}:`, selectError.message);
            continue;
          }
          
          if (allRecords && allRecords.length > 0) {
            const ids = allRecords.map(r => r.id);
            
            // Usa l'API per cancellare invece di .delete() diretto
            let baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
            if (baseUrl.endsWith('/api')) {
              baseUrl = baseUrl.slice(0, -4);
            }
            const apiUrl = baseUrl + '/api';
            
            const response = await fetch(`${apiUrl}/delete`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ table, ids })
            });
            
            if (!response.ok) {
              const error = await response.json().catch(() => ({ error: 'Unknown error' }));
              console.warn(`⚠️  Errore cancellazione ${table}:`, error.error || response.statusText);
            } else {
              const result = await response.json();
              console.log(`  ✓ Cancellati ${result.count || ids.length} record da ${table}`);
            }
          } else {
            console.log(`  ℹ️  Nessun record da cancellare in ${table}`);
          }
        } catch (error: any) {
          console.warn(`⚠️  Errore cancellazione ${table}:`, error.message);
        }
      }
      
      console.log('✅ Dati esistenti cancellati');
      
      // Prima creiamo/verifichiamo il superadmin
      console.log('🔐 Verificando/creando SuperAdmin...');
      const { data: existingSuperAdmin } = await supabase
        .from('super_admins')
        .select('id')
        .eq('email', 'riccardo.cirulli@gmail.com')
        .maybeSingle();
      
      if (!existingSuperAdmin) {
        const { error: superAdminError } = await supabase
          .from('super_admins')
          .insert({
            email: 'riccardo.cirulli@gmail.com',
            phone_number: '+39 123 456 7890',
            is_active: true,
            two_factor_enabled: false
          });
        
        if (superAdminError) {
          console.warn('⚠️ Errore creazione SuperAdmin:', superAdminError);
        } else {
          console.log('✅ SuperAdmin creato: riccardo.cirulli@gmail.com');
        }
      } else {
        console.log('✅ SuperAdmin già esistente: riccardo.cirulli@gmail.com');
      }
      
      // Recuperiamo o creiamo organizzazioni
      console.log('🏢 Verificando organizzazioni...');
      let { data: organizations } = await supabase
        .from('organizations')
        .select('id, name, slug');
      
      if (!organizations || organizations.length === 0) {
        console.log('📦 Creando organizzazioni di default...');
        const defaultOrgs = [
          { name: 'Alidaunia', slug: 'alidaunia' },
          { name: 'Elisoccorso Puglia', slug: 'elisoccorso-puglia' },
          { name: 'Elisoccorso Campania', slug: 'elisoccorso-campania' }
        ];
        
        const { data: newOrgs, error: orgError } = await supabase
          .from('organizations')
          .insert(defaultOrgs)
          .select('id, name, slug');
        
        if (orgError) {
          console.error('❌ Errore creazione organizzazioni:', orgError);
          throw orgError;
        }
        organizations = newOrgs;
        console.log(`✅ Create ${organizations.length} organizzazioni`);
      } else {
        // Assicuriamoci che tutte le organizzazioni abbiano uno slug
        for (const org of organizations) {
          if (!org.slug) {
            org.slug = org.name.toLowerCase().replace(/\s+/g, '-');
            await supabase
              .from('organizations')
              .update({ slug: org.slug })
              .eq('id', org.id)
              .catch(() => {
                // Ignora errori
              });
          }
        }
      }
      
      // Creiamo profili crew associati alle organizzazioni
      console.log('👥 Creando profili crew associati alle organizzazioni...');
      const crewProfiles = [];
      const firstNames = ['Marco', 'Giuseppe', 'Francesco', 'Antonio', 'Luca', 'Andrea', 'Roberto', 'Alessandro', 'Stefano', 'Paolo'];
      const lastNames = ['Rossi', 'Bianchi', 'Ferrari', 'Russo', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno'];
      const positions = ['captain', 'first_officer', 'cabin_crew', 'mechanic'];
      
      for (let i = 0; i < 20; i++) {
        const org = organizations[Math.floor(Math.random() * organizations.length)];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const position = positions[Math.floor(Math.random() * positions.length)];
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${org.slug}.it`;
        
        crewProfiles.push({
          id: crypto.randomUUID(),
          email: email,
          first_name: firstName,
          last_name: lastName,
          phone: `+39 3${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 1000)}`,
          organization_id: org.id,
          is_active: true
        });
      }
      
      // Inseriamo i profili crew in batch
      const PROFILE_BATCH_SIZE = 20;
      for (let i = 0; i < crewProfiles.length; i += PROFILE_BATCH_SIZE) {
        const batch = crewProfiles.slice(i, i + PROFILE_BATCH_SIZE);
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(batch);
        
        if (profileError) {
          console.warn(`⚠️ Errore inserimento profili batch ${Math.floor(i / PROFILE_BATCH_SIZE) + 1}:`, profileError);
        } else {
          console.log(`  ✓ Inseriti profili ${i + 1}-${Math.min(i + PROFILE_BATCH_SIZE, crewProfiles.length)}/${crewProfiles.length}`);
        }
      }
      
      // Creiamo anche i crew_members corrispondenti
      console.log('👨‍✈️ Creando crew_members...');
      const crewMembers = [];
      for (let i = 0; i < crewProfiles.length; i++) {
        const profile = crewProfiles[i];
        const position = positions[Math.floor(Math.random() * positions.length)];
        crewMembers.push({
          id: crypto.randomUUID(),
          organization_id: profile.organization_id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          position: position,
          license_number: `LIC-${Math.floor(Math.random() * 10000)}`,
          license_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          is_active: true
        });
      }
      
      // Inseriamo i crew_members in batch
      for (let i = 0; i < crewMembers.length; i += PROFILE_BATCH_SIZE) {
        const batch = crewMembers.slice(i, i + PROFILE_BATCH_SIZE);
        const { error: crewError } = await supabase
          .from('crew_members')
          .insert(batch);
        
        if (crewError) {
          console.warn(`⚠️ Errore inserimento crew_members batch ${Math.floor(i / PROFILE_BATCH_SIZE) + 1}:`, crewError);
        } else {
          console.log(`  ✓ Inseriti crew_members ${i + 1}-${Math.min(i + PROFILE_BATCH_SIZE, crewMembers.length)}/${crewMembers.length}`);
        }
      }

      // Creiamo account di autenticazione per ogni crew member con password "crew123"
      console.log('🔐 Creando account di autenticazione per crew members...');
      const CREW_PASSWORD = 'crew123';
      let authCreated = 0;
      let authSkipped = 0;
      
      for (const crewMember of crewMembers) {
        try {
          // Prova a creare l'account di autenticazione direttamente
          // Se esiste già, signUp restituirà un errore che gestiamo
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: crewMember.email,
            password: CREW_PASSWORD,
            options: {
              emailRedirectTo: `${window.location.origin}/crew-dashboard`,
              data: {
                first_name: crewMember.first_name,
                last_name: crewMember.last_name,
                user_type: 'crew'
              }
            }
          });

          if (authError) {
            // Se l'utente esiste già, ignora l'errore
            if (authError.message.includes('already registered') || 
                authError.message.includes('User already registered') ||
                authError.message.includes('already exists')) {
              authSkipped++;
              continue;
            }
            console.warn(`⚠️ Errore creazione auth per ${crewMember.email}:`, authError.message);
          } else if (authData?.user) {
            authCreated++;
            
            // Aggiorna il profilo con l'auth_id se esiste
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', crewMember.email)
              .maybeSingle();
            
            if (existingProfile) {
              // Il profilo esiste già, aggiorna l'id se necessario
              await supabase
                .from('profiles')
                .update({ id: authData.user.id })
                .eq('email', crewMember.email)
                .then(() => {
                  // Se l'update fallisce perché l'id è diverso, crea un nuovo profilo
                })
                .catch(() => {
                  // Ignora errori di update
                });
            } else {
              // Crea il profilo collegato all'account auth
              await supabase
                .from('profiles')
                .insert({
                  id: authData.user.id,
                  email: crewMember.email,
                  first_name: crewMember.first_name,
                  last_name: crewMember.last_name,
                  organization_id: crewMember.organization_id,
                  is_active: true
                })
                .catch(() => {
                  // Ignora errori se il profilo esiste già
                });
            }
          }
        } catch (error: any) {
          // Ignora errori e continua
          if (error?.message?.includes('already registered') || 
              error?.message?.includes('User already registered') ||
              error?.message?.includes('already exists')) {
            authSkipped++;
          } else {
            console.warn(`⚠️ Errore creazione auth per ${crewMember.email}:`, error.message);
          }
        }
      }
      
      if (authCreated > 0) {
        console.log(`  ✅ Creati ${authCreated} account di autenticazione (password: ${CREW_PASSWORD})`);
      }
      if (authSkipped > 0) {
        console.log(`  ℹ️  Saltati ${authSkipped} account già esistenti`);
      }
      
      // Verifichiamo se esistono elicotteri, altrimenti li creiamo
      console.log('🚁 Verificando elicotteri...');
      let { data: aircraft } = await supabase
        .from('aircraft')
        .select('id, tail_number, aircraft_type')
        .eq('aircraft_type', 'helicopter');
      
      if (!aircraft || aircraft.length === 0) {
        console.log('📦 Creando elicotteri di default...');
        const defaultAircraft = [
          // Elicotteri passeggeri (PTR)
          { tail_number: 'I-PTR01', manufacturer: 'AgustaWestland', model: 'AW139', aircraft_type: 'helicopter', organization_id: organizations[0]?.id, status: 'available' },
          { tail_number: 'I-PTR02', manufacturer: 'AgustaWestland', model: 'AW139', aircraft_type: 'helicopter', organization_id: organizations[0]?.id, status: 'available' },
          { tail_number: 'I-PTR03', manufacturer: 'AgustaWestland', model: 'AW109', aircraft_type: 'helicopter', organization_id: organizations[0]?.id, status: 'available' },
          // Elicotteri elisoccorso (SOC)
          { tail_number: 'I-SOC01', manufacturer: 'AgustaWestland', model: 'AW139', aircraft_type: 'helicopter', organization_id: organizations[1]?.id || organizations[0]?.id, status: 'available' },
          { tail_number: 'I-SOC02', manufacturer: 'AgustaWestland', model: 'AW139', aircraft_type: 'helicopter', organization_id: organizations[2]?.id || organizations[0]?.id, status: 'available' },
          { tail_number: 'I-SOC03', manufacturer: 'AgustaWestland', model: 'AW109', aircraft_type: 'helicopter', organization_id: organizations[1]?.id || organizations[0]?.id, status: 'available' },
        ];
        
        const { data: newAircraft, error: aircraftError } = await supabase
          .from('aircraft')
          .insert(defaultAircraft)
          .select('id, tail_number, aircraft_type');
        
        if (aircraftError) {
          console.error('❌ Errore creazione elicotteri:', aircraftError);
          throw aircraftError;
        }
        aircraft = newAircraft;
        console.log(`✅ Creati ${aircraft.length} elicotteri`);
      } else {
        console.log(`✅ Trovati ${aircraft.length} elicotteri esistenti`);
      }

      const data = generateSimulationData();
      
      // Recuperiamo TUTTI i crew members esistenti (inclusi quelli appena creati)
      const { data: existingCrewMembers } = await supabase
        .from('crew_members')
        .select('id, position, first_name, last_name, email, organization_id')
        .eq('is_active', true);
      
      if (!aircraft || aircraft.length === 0) {
        throw new Error('Nessun elicottero trovato dopo la creazione. Verifica gli errori sopra.');
      }
      
      if (!existingCrewMembers || existingCrewMembers.length === 0) {
        throw new Error('Nessun crew member trovato. I crew members sono stati creati sopra.');
      }
      
      console.log(`✅ Trovati ${existingCrewMembers.length} crew members totali per assegnazione dati`);

      // Separa piloti dagli altri crew members (usato in più sezioni)
      const pilots = existingCrewMembers.filter(c => c.position === 'captain' || c.position === 'first_officer');
      const otherCrew = existingCrewMembers.filter(c => c.position !== 'captain' && c.position !== 'first_officer');
      console.log(`👨‍✈️ Trovati ${pilots.length} piloti e ${otherCrew.length} altri crew members`);

      // Creiamo certificazioni per i crew members con vari stati (valide, in scadenza, scadute)
      console.log('📜 Creando certificazioni per crew members...');
      const certificationTypes = [
        { type: 'PPL(H)', aircraft: 'helicopter', validity: 24 }, // 24 mesi
        { type: 'CPL(H)', aircraft: 'helicopter', validity: 24 },
        { type: 'ATPL(H)', aircraft: 'helicopter', validity: 24 },
        { type: 'Type Rating AW139', aircraft: 'AW139', validity: 12 },
        { type: 'Type Rating AW109', aircraft: 'AW109', validity: 12 },
        { type: 'Medical Class 1', aircraft: null, validity: 12 },
        { type: 'Medical Class 2', aircraft: null, validity: 24 },
        { type: 'Instrument Rating', aircraft: 'helicopter', validity: 24 },
      ];
      
      let certsCreated = 0;
      
      for (const crewMember of existingCrewMembers) {
        // Ogni crew member ha 2-4 certificazioni
        const numCerts = Math.floor(Math.random() * 3) + 2;
        const selectedCerts = certificationTypes
          .sort(() => Math.random() - 0.5)
          .slice(0, numCerts);
        
        for (const certType of selectedCerts) {
          const issueDate = new Date(today);
          issueDate.setMonth(issueDate.getMonth() - Math.floor(Math.random() * 18) - 6); // 6-24 mesi fa
          
          const expiryDate = new Date(issueDate);
          expiryDate.setMonth(expiryDate.getMonth() + certType.validity);
          
          // Crea vari stati: 30% scadute, 20% in scadenza (prossimi 30 giorni), 50% valide
          const rand = Math.random();
          let finalExpiryDate = expiryDate;
          let isActive = true;
          
          if (rand < 0.3) {
            // Scadute (6-90 giorni fa)
            finalExpiryDate = new Date(today);
            finalExpiryDate.setDate(finalExpiryDate.getDate() - Math.floor(Math.random() * 85) - 6);
            isActive = false;
          } else if (rand < 0.5) {
            // In scadenza (prossimi 30 giorni)
            finalExpiryDate = new Date(today);
            finalExpiryDate.setDate(finalExpiryDate.getDate() + Math.floor(Math.random() * 30) + 1);
            isActive = true;
          }
          // Altrimenti valide (oltre 30 giorni)
          
          await supabase
            .from('crew_certifications')
            .insert({
              crew_member_id: crewMember.id,
              certification_type: certType.type,
              aircraft_type: certType.aircraft,
              certificate_number: `${certType.type.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
              issue_date: format(issueDate, 'yyyy-MM-dd'),
              expiry_date: format(finalExpiryDate, 'yyyy-MM-dd'),
              issuing_authority: 'ENAC',
              is_active: isActive
            })
            .then(() => {
              certsCreated++;
            })
            .catch(() => {
              // Ignora errori
            });
        }
      }
      console.log(`  ✅ Create ${certsCreated} certificazioni`);
      
      // Creiamo addestramenti da fare (training records con status 'scheduled' o 'pending')
      console.log('🎓 Creando addestramenti da fare...');
      const trainingTypes = [
        { type: 'Recurrent Training', description: 'Addestramento ricorrente obbligatorio', duration: 8 },
        { type: 'Type Rating Renewal', description: 'Rinnovo type rating', duration: 16 },
        { type: 'Simulator Training', description: 'Addestramento simulatore', duration: 4 },
        { type: 'Emergency Procedures', description: 'Procedure di emergenza', duration: 6 },
        { type: 'Night Operations', description: 'Operazioni notturne', duration: 4 },
        { type: 'Mountain Flying', description: 'Volo in montagna', duration: 8 },
      ];
      
      let trainingsCreated = 0;
      // Usa la variabile pilots già dichiarata sopra
      
      for (const pilot of pilots) {
        // 1-3 addestramenti da fare per pilota
        const numTrainings = Math.floor(Math.random() * 3) + 1;
        const selectedTrainings = trainingTypes
          .sort(() => Math.random() - 0.5)
          .slice(0, numTrainings);
        
        for (const trainingType of selectedTrainings) {
          // Addestramenti programmati nei prossimi 90 giorni
          const trainingDate = new Date(today);
          trainingDate.setDate(trainingDate.getDate() + Math.floor(Math.random() * 90) + 7); // 7-97 giorni da oggi
          
          // 70% scheduled, 30% pending
          const status = Math.random() < 0.7 ? 'scheduled' : 'pending';
          
          await supabase
            .from('training_records')
            .insert({
              pilot_id: pilot.id,
              instructor_id: null, // Sarà assegnato dopo
              training_type: trainingType.type,
              training_description: trainingType.description,
              training_organization: 'Alidaunia Training Center',
              training_date: format(trainingDate, 'yyyy-MM-dd'),
              duration_hours: trainingType.duration,
              expiry_date: null, // Alcuni addestramenti non hanno scadenza
              certification_achieved: null,
              status: status,
              counts_as_flight_time: false,
              counts_as_duty_time: true,
              ftl_applicable: true,
              notes: 'Addestramento programmato'
            })
            .then(() => {
              trainingsCreated++;
            })
            .catch(() => {
              // Ignora errori
            });
        }
      }
      console.log(`  ✅ Creati ${trainingsCreated} addestramenti da fare`);
      
      // Assegniamo aircraft_id ai voli
      const passengerHelis = aircraft.filter(a => a.tail_number.startsWith('I-PTR'));
      const rescueHelis = aircraft.filter(a => a.tail_number.startsWith('I-SOC'));
      
      data.flights.forEach(flight => {
        if (flight.flight_number.startsWith('TRM')) {
          // Voli passeggeri usano elicotteri PTR
          flight.aircraft_id = passengerHelis[Math.floor(Math.random() * passengerHelis.length)]?.id;
        } else {
          // Elisoccorso usa elicotteri SOC
          flight.aircraft_id = rescueHelis[Math.floor(Math.random() * rescueHelis.length)]?.id;
        }
      });
      
      // Assegniamo aircraft_id alle manutenzioni
      data.maintenanceRecords.forEach(record => {
        record.aircraft_id = aircraft[Math.floor(Math.random() * aircraft.length)]?.id;
        const mechanics = existingCrewMembers.filter(c => c.position === 'mechanic');
        if (mechanics.length > 0) {
        record.technician_id = mechanics[Math.floor(Math.random() * mechanics.length)]?.id;
        }
      });
      
      // Assegniamo aircraft_id e recorded_by ai record olio
      const mechanics = existingCrewMembers.filter(c => c.position === 'mechanic');
      data.oilRecords.forEach(record => {
        record.aircraft_id = aircraft[Math.floor(Math.random() * aircraft.length)]?.id;
        // Assegna un meccanico casuale se disponibile, altrimenti null
        if (mechanics.length > 0) {
          record.recorded_by = mechanics[Math.floor(Math.random() * mechanics.length)]?.id;
        } else {
          record.recorded_by = null;
        }
      });
      
      // Inseriamo i dati nel database in batch più piccoli per evitare errori 413
      const BATCH_SIZE = 100;
      
      // Inseriamo i voli in batch
      console.log(`Inserendo ${data.flights.length} voli in batch di ${BATCH_SIZE}...`);
      for (let i = 0; i < data.flights.length; i += BATCH_SIZE) {
        const batch = data.flights.slice(i, i + BATCH_SIZE);
      const { error: flightsError } = await supabase
        .from('flights')
          .insert(batch);
      
      if (flightsError) {
          console.error(`Errore inserimento voli batch ${Math.floor(i / BATCH_SIZE) + 1}:`, flightsError);
        throw flightsError;
        }
        console.log(`  ✓ Inseriti voli ${i + 1}-${Math.min(i + BATCH_SIZE, data.flights.length)}/${data.flights.length}`);
      }
      
      // Inseriamo le manutenzioni in batch
      console.log(`Inserendo ${data.maintenanceRecords.length} record manutenzione in batch di ${BATCH_SIZE}...`);
      for (let i = 0; i < data.maintenanceRecords.length; i += BATCH_SIZE) {
        const batch = data.maintenanceRecords.slice(i, i + BATCH_SIZE);
      const { error: maintenanceError } = await supabase
        .from('maintenance_records')
          .insert(batch);
      
      if (maintenanceError) {
          console.error(`Errore inserimento manutenzioni batch ${Math.floor(i / BATCH_SIZE) + 1}:`, maintenanceError);
        throw maintenanceError;
        }
        console.log(`  ✓ Inseriti record manutenzione ${i + 1}-${Math.min(i + BATCH_SIZE, data.maintenanceRecords.length)}/${data.maintenanceRecords.length}`);
      }
      
      // Inseriamo i record olio in batch
      console.log(`Inserendo ${data.oilRecords.length} record consumo olio in batch di ${BATCH_SIZE}...`);
      for (let i = 0; i < data.oilRecords.length; i += BATCH_SIZE) {
        const batch = data.oilRecords.slice(i, i + BATCH_SIZE);
      const { error: oilError } = await supabase
        .from('oil_consumption_records')
          .insert(batch);
      
      if (oilError) {
          console.error(`Errore inserimento record olio batch ${Math.floor(i / BATCH_SIZE) + 1}:`, oilError);
        throw oilError;
        }
        console.log(`  ✓ Inseriti record olio ${i + 1}-${Math.min(i + BATCH_SIZE, data.oilRecords.length)}/${data.oilRecords.length}`);
      }

      // Creiamo clients (necessari per voli e quotes)
      console.log('👥 Creando clients...');
      const { data: existingClients } = await supabase
        .from('clients')
        .select('id');
      
      if (!existingClients || existingClients.length === 0) {
        const clientNames = [
          'Regione Puglia', 'ASL Foggia', 'ASL Bari', 'Ospedale San Giovanni Rotondo',
          'Azienda Sanitaria Locale Campania', 'Ospedale Cardarelli Napoli', 'Azienda Ospedaliera Universitaria',
          'Turismo Tremiti SRL', 'Tremiti Express', 'Isola Bella Tours', 'Parco Nazionale del Gargano',
          'Ministero della Salute', 'Protezione Civile Puglia', 'Protezione Civile Campania'
        ];
        
        const clients = clientNames.map(name => ({
          organization_id: organizations[0]?.id,
          company_name: name,
          contact_person: name.includes('ASL') || name.includes('Ospedale') ? 'Direttore Sanitario' : 'Responsabile',
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.it`,
          phone: `+39 0${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 10000000)}`,
          city: name.includes('Campania') || name.includes('Napoli') ? 'Napoli' : 'Foggia',
          country: 'Italia'
        }));
        
        const { data: newClients, error: clientsError } = await supabase
          .from('clients')
          .insert(clients)
          .select('id');
        
        if (clientsError) {
          console.warn('⚠️ Errore creazione clients:', clientsError);
        } else {
          console.log(`  ✅ Creati ${newClients?.length || 0} clients`);
        }
      } else {
        console.log(`  ✅ Trovati ${existingClients.length} clients esistenti`);
      }

      // Recuperiamo tutti i clients (esistenti o appena creati)
      const { data: allClients } = await supabase
        .from('clients')
        .select('id');
      
      // Nota: L'assegnazione clients ai voli viene saltata per evitare problemi con join automatici
      // I clients sono stati creati e possono essere assegnati manualmente ai voli se necessario
      // Questo non è critico per la demo - i clients esistono e possono essere usati nelle quotes

      // Creiamo quotes (necessarie per modulo SALES)
      console.log('💰 Creando quotes...');
      const { data: existingQuotes } = await supabase
        .from('quotes')
        .select('id');
      
      if (!existingQuotes || existingQuotes.length === 0 && allClients && allClients.length > 0) {
        const quotes = [];
        const statuses = ['pending', 'confirmed', 'expired', 'cancelled'];
        const airports = ['LIBF', 'LIIT', 'LIBN', 'LIRN', 'LIME', 'LIRQ'];
        
        for (let i = 0; i < 25; i++) {
          const quoteDate = new Date(today);
          quoteDate.setDate(quoteDate.getDate() + Math.floor(Math.random() * 180) - 30); // -30 a +150 giorni
          
          const departureAirport = airports[Math.floor(Math.random() * airports.length)];
          let arrivalAirport = airports[Math.floor(Math.random() * airports.length)];
          while (arrivalAirport === departureAirport) {
            arrivalAirport = airports[Math.floor(Math.random() * airports.length)];
          }
          
          const baseCost = Math.floor(Math.random() * 5000) + 2000;
          const fuelCost = Math.floor(Math.random() * 1000) + 500;
          const handlingCost = Math.floor(Math.random() * 500) + 200;
          const crewCost = Math.floor(Math.random() * 800) + 400;
          const otherCosts = Math.floor(Math.random() * 300) + 100;
          const subtotal = baseCost + fuelCost + handlingCost + crewCost + otherCosts;
          const margin = subtotal * 0.15; // 15% margine
          const vatRate = 22; // 22% IVA
          const vatAmount = (subtotal + margin) * (vatRate / 100);
          const totalAmount = subtotal + margin + vatAmount;
          
          quotes.push({
            organization_id: organizations[0]?.id,
            client_id: allClients[Math.floor(Math.random() * allClients.length)].id,
            quote_number: `QT-${format(quoteDate, 'yyyyMMdd')}-${String(i + 1).padStart(3, '0')}`,
            departure_airport: departureAirport,
            arrival_airport: arrivalAirport,
            departure_date: format(quoteDate, 'yyyy-MM-dd'),
            return_date: Math.random() > 0.5 ? format(addDays(quoteDate, Math.floor(Math.random() * 7) + 1), 'yyyy-MM-dd') : null,
            aircraft_type: Math.random() > 0.5 ? 'AW139' : 'AW109',
            passenger_count: Math.floor(Math.random() * 10) + 1,
            base_cost: baseCost,
            fuel_cost: fuelCost,
            handling_cost: handlingCost,
            crew_cost: crewCost,
            other_costs: otherCosts,
            margin_percentage: 15,
            vat_rate: vatRate,
            vat_amount: vatAmount,
            total_amount: totalAmount,
            pricing_method: Math.random() > 0.5 ? 'fixed' : 'hourly',
            status: statuses[Math.floor(Math.random() * statuses.length)],
            valid_until: format(addDays(quoteDate, 30), 'yyyy-MM-dd'),
            notes: 'Quote generata automaticamente dalla simulazione'
          });
        }
        
        const { data: newQuotes, error: quotesError } = await supabase
          .from('quotes')
          .insert(quotes)
          .select('id, quote_number');
        
        if (quotesError) {
          console.warn('⚠️ Errore creazione quotes:', quotesError);
        } else {
          console.log(`  ✅ Create ${newQuotes?.length || 0} quotes`);
          
          // Colleghiamo alcune quotes ai voli
          if (newQuotes && newQuotes.length > 0) {
            const { data: flightsForQuotes } = await supabase
              .from('flights')
              .select('id')
              .limit(10);
            
            if (flightsForQuotes && flightsForQuotes.length > 0) {
              const quoteFlightLinks = [];
              for (let i = 0; i < Math.min(10, newQuotes.length); i++) {
                quoteFlightLinks.push({
                  quote_id: newQuotes[i].id,
                  flight_id: flightsForQuotes[i].id,
                  status: 'linked',
                  linked_by: null
                });
              }
              
              const { error: linksError } = await supabase
                .from('quote_flight_links')
                .insert(quoteFlightLinks);
              
              if (linksError) {
                console.warn('⚠️ Errore creazione quote_flight_links:', linksError);
              } else {
                console.log(`  ✅ Creati ${quoteFlightLinks.length} collegamenti quote-voli`);
              }
            }
          }
        }
      } else {
        console.log(`  ✅ Trovate ${existingQuotes?.length || 0} quotes esistenti`);
      }

      // Creiamo flight_legs per alcuni voli multi-tratta
      console.log('✈️  Creando flight_legs...');
      const { data: flightsForLegs } = await supabase
        .from('flights')
        .select('id, departure_airport, arrival_airport, departure_time, arrival_time')
        .limit(50);
      
      if (flightsForLegs && flightsForLegs.length > 0) {
        const flightLegs = [];
        for (const flight of flightsForLegs.slice(0, 20)) { // Solo 20 voli con tratte
          const depTime = new Date(flight.departure_time);
          const arrTime = new Date(flight.arrival_time);
          const duration = (arrTime.getTime() - depTime.getTime()) / (1000 * 60); // minuti
          
          // Crea 2-3 tratte
          const numLegs = Math.floor(Math.random() * 2) + 2;
          const legDuration = duration / numLegs;
          
          for (let leg = 0; leg < numLegs; leg++) {
            const legDepTime = new Date(depTime.getTime() + leg * legDuration * 60000);
            const legArrTime = new Date(legDepTime.getTime() + legDuration * 60000);
            
            flightLegs.push({
              flight_id: flight.id,
              leg_number: leg + 1,
              departure_airport: leg === 0 ? flight.departure_airport : 'LIBN', // Aeroporto intermedio
              arrival_airport: leg === numLegs - 1 ? flight.arrival_airport : 'LIBN',
              departure_time: format(legDepTime, 'yyyy-MM-dd HH:mm:ss'),
              arrival_time: format(legArrTime, 'yyyy-MM-dd HH:mm:ss'),
              distance: Math.floor(Math.random() * 200) + 50,
              fuel_required: Math.floor(Math.random() * 500) + 200
            });
          }
        }
        
        if (flightLegs.length > 0) {
          const { error: legsError } = await supabase
            .from('flight_legs')
            .insert(flightLegs);
          
          if (legsError) {
            console.warn('⚠️ Errore creazione flight_legs:', legsError);
          } else {
            console.log(`  ✅ Creati ${flightLegs.length} flight_legs`);
          }
        }
      }

      // Creiamo schedule_changes (modifiche schedule)
      console.log('📅 Creando schedule_changes...');
      const { data: flightsForChanges } = await supabase
        .from('flights')
        .select('id, departure_time, arrival_time, departure_airport, arrival_airport')
        .limit(30);
      
      if (flightsForChanges && flightsForChanges.length > 0) {
        const scheduleChanges = [];
        for (const flight of flightsForChanges.slice(0, 15)) { // Solo 15 modifiche
          const changeTypes = ['time_change', 'airport_change', 'cancellation', 'delay'];
          const changeType = changeTypes[Math.floor(Math.random() * changeTypes.length)];
          
          let oldValue: any = {};
          let newValue: any = {};
          
          if (changeType === 'time_change') {
            const oldDepTime = new Date(flight.departure_time);
            const newDepTime = new Date(oldDepTime.getTime() + (Math.floor(Math.random() * 120) - 60) * 60000);
            oldValue = { departure_time: flight.departure_time };
            newValue = { departure_time: format(newDepTime, 'yyyy-MM-dd HH:mm:ss') };
          } else if (changeType === 'airport_change') {
            oldValue = { arrival_airport: flight.arrival_airport };
            newValue = { arrival_airport: 'LIBN' };
          } else if (changeType === 'cancellation') {
            oldValue = { status: 'scheduled' };
            newValue = { status: 'cancelled' };
          } else {
            oldValue = { status: 'scheduled' };
            newValue = { status: 'delayed' };
          }
          
          scheduleChanges.push({
            flight_id: flight.id,
            change_type: changeType,
            old_value: oldValue,
            new_value: newValue,
            reason: 'Modifica operativa richiesta',
            changed_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            changed_by: null
          });
        }
        
        if (scheduleChanges.length > 0) {
          const { error: changesError } = await supabase
            .from('schedule_changes')
            .insert(scheduleChanges);
          
          if (changesError) {
            console.warn('⚠️ Errore creazione schedule_changes:', changesError);
          } else {
            console.log(`  ✅ Creati ${scheduleChanges.length} schedule_changes`);
          }
        }
      }

      // Creiamo handling_requests
      console.log('🛫 Creando handling_requests...');
      const { data: flightsForHandling } = await supabase
        .from('flights')
        .select('id, departure_airport, arrival_airport')
        .limit(40);
      
      if (flightsForHandling && flightsForHandling.length > 0) {
        const handlingRequests = [];
        const serviceTypes = ['ground_handling', 'fuel', 'catering', 'cleaning', 'parking'];
        
        for (const flight of flightsForHandling.slice(0, 25)) {
          const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
          const statuses = ['pending', 'confirmed', 'completed'];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          handlingRequests.push({
            flight_id: flight.id,
            airport_code: Math.random() > 0.5 ? flight.departure_airport : flight.arrival_airport,
            service_type: serviceType,
            request_details: `Richiesta ${serviceType} per volo ${flight.id.substring(0, 8)}`,
            status: status,
            requested_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            requested_by: null,
            notes: 'Richiesta generata automaticamente'
          });
        }
        
        if (handlingRequests.length > 0) {
          const { error: handlingError } = await supabase
            .from('handling_requests')
            .insert(handlingRequests);
          
          if (handlingError) {
            console.warn('⚠️ Errore creazione handling_requests:', handlingError);
          } else {
            console.log(`  ✅ Create ${handlingRequests.length} handling_requests`);
          }
        }
      }

      // Creiamo messages (messaggi SALES)
      console.log('💬 Creando messages...');
      const { data: quotesForMessages } = await supabase
        .from('quotes')
        .select('id, quote_number, client_id')
        .limit(15);
      
      if (quotesForMessages && quotesForMessages.length > 0 && allClients && allClients.length > 0) {
        const messages = [];
        const messageTypes = ['quote_request', 'quote_response', 'booking_confirmation', 'general'];
        
        for (const quote of quotesForMessages) {
          const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
          const statuses = ['sent', 'delivered', 'read'];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          messages.push({
            quote_id: quote.id,
            sender_name: 'Sales Team',
            sender_email: 'sales@alidaunia.it',
            recipient_name: 'Cliente',
            recipient_email: 'cliente@example.it',
            subject: `Quote ${quote.quote_number} - ${messageType === 'quote_request' ? 'Richiesta' : 'Conferma'}`,
            content: `Messaggio relativo alla quote ${quote.quote_number}. Tipo: ${messageType}`,
            message_type: messageType,
            status: status,
            is_internal: false
          });
        }
        
        if (messages.length > 0) {
          const { error: messagesError } = await supabase
            .from('messages')
            .insert(messages);
          
          if (messagesError) {
            console.warn('⚠️ Errore creazione messages:', messagesError);
          } else {
            console.log(`  ✅ Creati ${messages.length} messages`);
          }
        }
      }

      // Creiamo airport_directory (aeroporti principali)
      console.log('🛬 Creando airport_directory...');
      const { data: existingAirports } = await supabase
        .from('airport_directory')
        .select('id');
      
      if (!existingAirports || existingAirports.length === 0) {
        const airports = [
          { code: 'LIBF', name: 'Aeroporto di Foggia' },
          { code: 'LIIT', name: 'Aeroporto delle Isole Tremiti' },
          { code: 'LIBN', name: 'Aeroporto di Bari' },
          { code: 'LIRN', name: 'Aeroporto di Napoli' },
          { code: 'LIME', name: 'Aeroporto di Bergamo' },
          { code: 'LIRQ', name: 'Aeroporto di Firenze' }
        ];
        
        const airportDirectory = airports.map(airport => ({
          airport_code: airport.code,
          airport_name: airport.name,
          contact_info: { phone: '+39 123 456 7890', email: `info@${airport.code.toLowerCase()}.it` },
          opening_hours: { from: '06:00', to: '22:00' },
          available_services: ['fuel', 'ground_handling', 'parking', 'catering']
        }));
        
        const { error: airportsError } = await supabase
          .from('airport_directory')
          .insert(airportDirectory);
        
        if (airportsError) {
          console.warn('⚠️ Errore creazione airport_directory:', airportsError);
        } else {
          console.log(`  ✅ Creati ${airportDirectory.length} aeroporti in directory`);
        }
      } else {
        console.log(`  ✅ Trovati ${existingAirports.length} aeroporti esistenti`);
      }

      // Creiamo vat_rates (aliquote IVA)
      console.log('📊 Creando vat_rates...');
      const { data: existingVatRates } = await supabase
        .from('vat_rates')
        .select('id');
      
      if (!existingVatRates || existingVatRates.length === 0) {
        const vatRates = [
          { country_code: 'IT', country_name: 'Italia', vat_rate: 22, is_default: true },
          { country_code: 'FR', country_name: 'Francia', vat_rate: 20, is_default: false },
          { country_code: 'DE', country_name: 'Germania', vat_rate: 19, is_default: false },
          { country_code: 'ES', country_name: 'Spagna', vat_rate: 21, is_default: false }
        ];
        
        const { error: vatError } = await supabase
          .from('vat_rates')
          .insert(vatRates);
        
        if (vatError) {
          console.warn('⚠️ Errore creazione vat_rates:', vatError);
        } else {
          console.log(`  ✅ Create ${vatRates.length} aliquote IVA`);
        }
      } else {
        console.log(`  ✅ Trovate ${existingVatRates.length} aliquote IVA esistenti`);
      }

      // Creiamo dati associati per ogni crew member (assegnazioni voli, statistiche, ore di volo)
      console.log('\n📊 Creando dati associati per crew members...');
      
      // 1. Assegnazioni voli - PRIMA assegniamo i PILOTI a ogni volo, poi gli altri crew
      console.log('  📅 Creando assegnazioni voli...');
      const allFlights = data.flights;
      let assignmentsCreated = 0;
      
      if (pilots.length === 0) {
        throw new Error('Nessun pilota trovato! Assicurati che ci siano crew members con position "captain" o "first_officer"');
      }
      
      // PRIMA FASE: Assegna piloti a ogni volo (ogni volo deve avere almeno un pilota)
      console.log('    ✈️  Assegnando piloti ai voli...');
      
      // Separa captain e first_officer per distribuzione migliore
      const captains = pilots.filter(p => p.position === 'captain');
      const firstOfficers = pilots.filter(p => p.position === 'first_officer');
      
      // Traccia quante assegnazioni ha ogni pilota per distribuzione uniforme
      const pilotAssignmentCount = new Map<string, number>();
      pilots.forEach(p => pilotAssignmentCount.set(p.id, 0));
      
      // Mescola i voli per distribuzione casuale
      const shuffledFlights = [...allFlights].sort(() => Math.random() - 0.5);
      
      for (const flight of shuffledFlights) {
        if (!flight.departure_time || !flight.arrival_time || !flight.id) {
          continue; // Salta voli senza dati validi
        }
        
        const departureTime = new Date(flight.departure_time);
        const arrivalTime = new Date(flight.arrival_time);
        
        // Verifica che le date siano valide
        if (isNaN(departureTime.getTime()) || isNaN(arrivalTime.getTime())) {
          continue; // Salta date non valide
        }
        
        const flightHours = (arrivalTime.getTime() - departureTime.getTime()) / (1000 * 60 * 60);
        const dutyHours = flightHours + 0.5;
        
        // Verifica che flightHours sia un numero valido
        if (isNaN(flightHours) || !isFinite(flightHours) || flightHours <= 0) {
          continue; // Salta calcoli non validi
        }
        
        // Assegna sempre un captain (distribuisci uniformemente tra i captain disponibili)
        let captain;
        if (captains.length > 0) {
          // Ordina i captain per numero di assegnazioni (meno assegnati prima)
          const sortedCaptains = captains.sort((a, b) => {
            const countA = pilotAssignmentCount.get(a.id) || 0;
            const countB = pilotAssignmentCount.get(b.id) || 0;
            return countA - countB;
          });
          captain = sortedCaptains[0];
        } else {
          // Se non ci sono captain, usa il primo pilota disponibile
          captain = pilots[0];
        }
        
        if (captain) {
          const { data: existingAssignment } = await supabase
            .from('crew_flight_assignments')
            .select('id')
            .eq('flight_id', flight.id)
            .eq('crew_member_id', captain.id)
            .maybeSingle();
          
          if (!existingAssignment) {
            await supabase
              .from('crew_flight_assignments')
              .insert({
                flight_id: flight.id,
                crew_member_id: captain.id,
                position: captain.position,
                reporting_time: new Date(departureTime.getTime() - 30 * 60 * 1000).toISOString(),
                duty_start_time: departureTime.toISOString(),
                duty_end_time: new Date(arrivalTime.getTime() + 30 * 60 * 1000).toISOString(),
                flight_time_hours: parseFloat(Number(flightHours).toFixed(2)),
                duty_time_hours: parseFloat(Number(dutyHours).toFixed(2)),
                rest_time_hours: 12.0,
                ftl_compliant: true,
                airport_recency_valid: true,
                currency_valid: true,
                certificates_valid: true,
                passport_valid: true,
                visa_valid: true
              })
              .then(() => {
                assignmentsCreated++;
                pilotAssignmentCount.set(captain.id, (pilotAssignmentCount.get(captain.id) || 0) + 1);
              })
              .catch(() => {
                // Ignora errori
              });
          }
        }
        
        // 70% dei voli ha anche un first_officer
        const needsTwoPilots = Math.random() < 0.7;
        if (needsTwoPilots && firstOfficers.length > 0) {
          // Ordina i first_officer per numero di assegnazioni (meno assegnati prima)
          const sortedFirstOfficers = firstOfficers.sort((a, b) => {
            const countA = pilotAssignmentCount.get(a.id) || 0;
            const countB = pilotAssignmentCount.get(b.id) || 0;
            return countA - countB;
          });
          const firstOfficer = sortedFirstOfficers[0];
          
          if (firstOfficer && firstOfficer.id !== captain?.id) {
            const { data: existingAssignment } = await supabase
              .from('crew_flight_assignments')
              .select('id')
              .eq('flight_id', flight.id)
              .eq('crew_member_id', firstOfficer.id)
              .maybeSingle();
            
            if (!existingAssignment) {
              await supabase
                .from('crew_flight_assignments')
                .insert({
                  flight_id: flight.id,
                  crew_member_id: firstOfficer.id,
                  position: firstOfficer.position,
                  reporting_time: new Date(departureTime.getTime() - 30 * 60 * 1000).toISOString(),
                  duty_start_time: departureTime.toISOString(),
                  duty_end_time: new Date(arrivalTime.getTime() + 30 * 60 * 1000).toISOString(),
                  flight_time_hours: parseFloat(Number(flightHours).toFixed(2)),
                  duty_time_hours: parseFloat(Number(dutyHours).toFixed(2)),
                  rest_time_hours: 12.0,
                  ftl_compliant: true,
                  airport_recency_valid: true,
                  currency_valid: true,
                  certificates_valid: true,
                  passport_valid: true,
                  visa_valid: true
                })
                .then(() => {
                  assignmentsCreated++;
                  pilotAssignmentCount.set(firstOfficer.id, (pilotAssignmentCount.get(firstOfficer.id) || 0) + 1);
                })
                .catch(() => {
                  // Ignora errori
                });
            }
          }
        }
      }
      
      console.log(`    ✅ Assegnati piloti a ${allFlights.length} voli`);
      
      // SECONDA FASE: Assegna altri crew members (cabin_crew, mechanic) ad alcuni voli
      console.log('    👥 Assegnando altri crew members ad alcuni voli...');
      const flightsWithPilots = allFlights.filter(f => f.id); // Voli che hanno già piloti
      
      for (const crewMember of otherCrew) {
        // Assegna 3-10 voli casuali a ogni altro crew member
        const numAssignments = Math.floor(Math.random() * 8) + 3;
        const selectedFlights = flightsWithPilots
          .sort(() => Math.random() - 0.5)
          .slice(0, numAssignments);
        
        for (const flight of selectedFlights) {
          if (!flight.departure_time || !flight.arrival_time || !flight.id) {
            continue;
          }
          
          const departureTime = new Date(flight.departure_time);
          const arrivalTime = new Date(flight.arrival_time);
          
          if (isNaN(departureTime.getTime()) || isNaN(arrivalTime.getTime())) {
            continue;
          }
          
          const flightHours = (arrivalTime.getTime() - departureTime.getTime()) / (1000 * 60 * 60);
          const dutyHours = flightHours + 0.5;
          
          if (isNaN(flightHours) || !isFinite(flightHours) || flightHours <= 0) {
            continue;
          }
          
          // Verifica se l'assegnazione esiste già
          const { data: existingAssignment } = await supabase
            .from('crew_flight_assignments')
            .select('id')
            .eq('flight_id', flight.id)
            .eq('crew_member_id', crewMember.id)
            .maybeSingle();
          
          if (!existingAssignment) {
            await supabase
              .from('crew_flight_assignments')
              .insert({
                flight_id: flight.id,
                crew_member_id: crewMember.id,
                position: crewMember.position,
                reporting_time: new Date(departureTime.getTime() - 30 * 60 * 1000).toISOString(),
                duty_start_time: departureTime.toISOString(),
                duty_end_time: new Date(arrivalTime.getTime() + 30 * 60 * 1000).toISOString(),
                flight_time_hours: parseFloat(Number(flightHours).toFixed(2)),
                duty_time_hours: parseFloat(Number(dutyHours).toFixed(2)),
                rest_time_hours: 12.0,
                ftl_compliant: true,
                airport_recency_valid: true,
                currency_valid: true,
                certificates_valid: true,
                passport_valid: true,
                visa_valid: true
              })
              .then(() => {
                assignmentsCreated++;
              })
              .catch(() => {
                // Ignora errori
              });
          }
        }
      }
      
      console.log(`    ✅ Create ${assignmentsCreated} assegnazioni voli totali (pilot + altri crew)`);
      
      // 2. Statistiche mensili per ogni crew member (ultimi 6 mesi)
      console.log('  📊 Creando statistiche mensili...');
      let statsCreated = 0;
      
      for (const crewMember of existingCrewMembers) {
        for (let i = 0; i < 6; i++) {
          const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthYear = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
          
          // Verifica se le statistiche esistono già
          const { data: existingStats } = await supabase
            .from('crew_statistics')
            .select('id')
            .eq('crew_member_id', crewMember.id)
            .eq('month_year', monthYear)
            .maybeSingle();
          
          if (!existingStats) {
            const flightHours = Math.random() * 50 + 30;
            const flights = Math.floor(Math.random() * 20 + 10);
            const dutyHours = flightHours + (Math.random() * 20 + 10);
            const nightHours = flightHours * 0.2;
            const sectors = flights * 1.5;
            
            await supabase
              .from('crew_statistics')
              .insert({
                crew_member_id: crewMember.id,
                month_year: monthYear,
                total_flights: flights,
                total_sectors: Math.floor(sectors),
                total_flight_hours: parseFloat(flightHours.toFixed(2)),
                total_duty_hours: parseFloat(dutyHours.toFixed(2)),
                night_hours: parseFloat(nightHours.toFixed(2)),
                simulator_hours: parseFloat((Math.random() * 5).toFixed(2)),
                training_hours: parseFloat((Math.random() * 3).toFixed(2)),
                days_off: Math.floor(Math.random() * 5 + 5),
                ftl_violations: 0,
                performance_rating: parseFloat((Math.random() * 2 + 8).toFixed(2))
              })
              .then(() => {
                statsCreated++;
              })
              .catch(() => {
                // Ignora errori
              });
          }
        }
      }
      console.log(`    ✅ Create ${statsCreated} statistiche mensili`);
      
      // 2.5. Creiamo crew_time (gestione tempo, voli assegnati, fatica)
      console.log('  ⏰ Creando crew_time (tempo e fatica)...');
      let crewTimeCreated = 0;
      
      // Per ogni crew member, creiamo record crew_time per i giorni con voli assegnati
      const { data: allAssignments } = await supabase
        .from('crew_flight_assignments')
        .select('crew_member_id, duty_start_time, duty_end_time, flight_time_hours, duty_time_hours, flight_id');
      
      if (allAssignments && allAssignments.length > 0) {
        // Raggruppa per crew member e data
        const crewTimeMap = new Map<string, {
          crew_member_id: string;
          date: string;
          duty_hours: number;
          flight_hours: number;
          flights: number;
        }>();
        
        for (const assignment of allAssignments) {
          if (!assignment.duty_start_time) continue;
          
          const dutyStart = new Date(assignment.duty_start_time);
          const dateKey = format(dutyStart, 'yyyy-MM-dd');
          const mapKey = `${assignment.crew_member_id}-${dateKey}`;
          
          if (!crewTimeMap.has(mapKey)) {
            crewTimeMap.set(mapKey, {
              crew_member_id: assignment.crew_member_id,
              date: dateKey,
              duty_hours: 0,
              flight_hours: 0,
              flights: 0
            });
          }
          
          const entry = crewTimeMap.get(mapKey)!;
          // Converti in numero e verifica che sia valido
          const dutyHours = parseFloat(assignment.duty_time_hours) || 0;
          const flightHours = parseFloat(assignment.flight_time_hours) || 0;
          
          if (isNaN(dutyHours) || !isFinite(dutyHours)) {
            continue; // Salta assegnazioni con dati non validi
          }
          if (isNaN(flightHours) || !isFinite(flightHours)) {
            continue; // Salta assegnazioni con dati non validi
          }
          
          entry.duty_hours += dutyHours;
          entry.flight_hours += flightHours;
          entry.flights += 1;
        }
        
        // Calcola fatica basata su duty hours e voli
        for (const [key, entry] of crewTimeMap.entries()) {
          // Assicurati che i valori siano numeri validi
          const dutyHours = Number(entry.duty_hours) || 0;
          const flightHours = Number(entry.flight_hours) || 0;
          
          if (isNaN(dutyHours) || !isFinite(dutyHours) || isNaN(flightHours) || !isFinite(flightHours)) {
            continue; // Salta entry con dati non validi
          }
          
          // Fatica: 1-3 (bassa) se < 6h, 4-6 (media) se 6-10h, 7-10 (alta) se > 10h
          let fatigueLevel = 1;
          if (dutyHours > 10) {
            fatigueLevel = Math.floor(Math.random() * 4) + 7; // 7-10
          } else if (dutyHours > 6) {
            fatigueLevel = Math.floor(Math.random() * 3) + 4; // 4-6
          } else {
            fatigueLevel = Math.floor(Math.random() * 3) + 1; // 1-3
          }
          
          // FTL compliant se duty hours < 14
          const ftlCompliant = dutyHours < 14;
          const ftlViolations = ftlCompliant ? 0 : 1;
          
          // Rest hours: 12-16 ore (inversamente proporzionale a duty hours)
          const restHours = Math.max(12, 16 - (dutyHours / 2));
          
          await supabase
            .from('crew_time')
            .insert({
              crew_member_id: entry.crew_member_id,
              date: entry.date,
              total_duty_hours: parseFloat(dutyHours.toFixed(2)),
              total_flight_hours: parseFloat(flightHours.toFixed(2)),
              total_rest_hours: parseFloat(restHours.toFixed(2)),
              flights_assigned: entry.flights,
              fatigue_level: fatigueLevel,
              ftl_compliant: ftlCompliant,
              ftl_violations: ftlViolations,
              notes: `Calcolato da ${entry.flights} voli assegnati`
            })
            .then(() => {
              crewTimeCreated++;
            })
            .catch(() => {
              // Ignora errori (potrebbe già esistere)
            });
        }
      }
      console.log(`    ✅ Create ${crewTimeCreated} record crew_time`);
      
      // 3. Record ore di volo per voli completati - basati sulle assegnazioni esistenti
      console.log('  📝 Creando record ore di volo per piloti (basati su assegnazioni volo)...');
      let hoursCreated = 0;
      
      // Recupera tutte le assegnazioni volo per i piloti che hanno voli completati
      const { data: pilotAssignments } = await supabase
        .from('crew_flight_assignments')
        .select(`
          crew_member_id, 
          flight_id, 
          flight_time_hours, 
          duty_time_hours,
          flight:flights(id, departure_time, arrival_time, status)
        `)
        .in('crew_member_id', pilots.map(p => p.id));
      
      if (pilotAssignments && pilotAssignments.length > 0) {
        // Filtra solo le assegnazioni per voli completati
        const completedAssignments = pilotAssignments.filter(a => 
          a.flight && a.flight.status === 'completed'
        );
        
        console.log(`    📊 Trovate ${completedAssignments.length} assegnazioni per voli completati`);
        
        // Per ogni assegnazione, crea un record pilot_flight_hours
        for (const assignment of completedAssignments) {
          if (!assignment.flight || !assignment.flight.departure_time || !assignment.flight.arrival_time) {
            continue;
          }
          
          const departureTime = new Date(assignment.flight.departure_time);
          const arrivalTime = new Date(assignment.flight.arrival_time);
          
          if (isNaN(departureTime.getTime()) || isNaN(arrivalTime.getTime())) {
            continue;
          }
          
          // Usa flight_time_hours dall'assegnazione se disponibile, altrimenti calcola
          const flightHours = assignment.flight_time_hours 
            ? Number(assignment.flight_time_hours)
            : (arrivalTime.getTime() - departureTime.getTime()) / (1000 * 60 * 60);
          
          if (isNaN(flightHours) || !isFinite(flightHours) || flightHours <= 0) {
            continue;
          }
          
          // Trova il pilota corrispondente
          const pilot = pilots.find(p => p.id === assignment.crew_member_id);
          if (!pilot) continue;
          
          // Verifica se esiste già
          const { data: existingHours } = await supabase
            .from('pilot_flight_hours')
            .select('id')
            .eq('pilot_id', pilot.id)
            .eq('flight_id', assignment.flight_id)
            .maybeSingle();
          
          if (!existingHours) {
            // Determina se è volo single o multi-pilot
            const { data: flightPilots } = await supabase
              .from('crew_flight_assignments')
              .select('position')
              .eq('flight_id', assignment.flight_id)
              .in('position', ['captain', 'first_officer']);
            
            const hasTwoPilots = flightPilots && flightPilots.length >= 2;
            
            await supabase
              .from('pilot_flight_hours')
              .insert({
                pilot_id: pilot.id,
                flight_id: assignment.flight_id,
                flight_date: departureTime.toISOString().split('T')[0],
                flight_type: 'commercial',
                block_time_hours: parseFloat(Number(flightHours).toFixed(2)),
                flight_time_single_pilot_hours: (!hasTwoPilots && pilot.position === 'captain') ? parseFloat(Number(flightHours).toFixed(2)) : 0,
                flight_time_multi_pilot_hours: (hasTwoPilots || pilot.position === 'first_officer') ? parseFloat(Number(flightHours).toFixed(2)) : 0,
                night_hours: (Math.random() < 0.3) ? parseFloat((flightHours * 0.2).toFixed(2)) : 0,
                ifr_hours: (Math.random() < 0.5) ? parseFloat((flightHours * 0.5).toFixed(2)) : 0,
                pic_hours: (pilot.position === 'captain') ? parseFloat(Number(flightHours).toFixed(2)) : 0,
                sic_hours: (pilot.position === 'first_officer') ? parseFloat(Number(flightHours).toFixed(2)) : 0,
                dual_hours: 0,
                instructor_hours: 0,
                simulator_hours: 0,
                landings_day: Math.floor(Math.random() * 2) + 1,
                landings_night: (Math.random() < 0.3) ? Math.floor(Math.random() * 1) + 1 : 0,
                notes: 'Record ore di volo simulato'
              })
              .then(() => {
                hoursCreated++;
              })
              .catch(() => {
                // Ignora errori
              });
          }
        }
      }
      console.log(`    ✅ Creati ${hoursCreated} record ore di volo per piloti`);
      
      // 4. Crea pilot_schedule per ogni pilota (schedule mensili)
      console.log('  📅 Creando schedule per piloti...');
      let schedulesCreated = 0;
      
      for (const crewMember of existingCrewMembers) {
        if (crewMember.position === 'captain' || crewMember.position === 'first_officer') {
          // Crea schedule per i prossimi 3 mesi
          for (let i = 0; i < 3; i++) {
            const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
            const startDate = new Date(monthDate);
            const endDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
            
            // Verifica se lo schedule esiste già
            const { data: existingSchedule } = await supabase
              .from('pilot_schedule')
              .select('id')
              .eq('pilot_id', crewMember.id)
              .eq('schedule_type', 'monthly')
              .gte('start_date', startDate.toISOString().split('T')[0])
              .lte('end_date', endDate.toISOString().split('T')[0])
              .maybeSingle();
            
            if (!existingSchedule) {
              await supabase
                .from('pilot_schedule')
                .insert({
                  pilot_id: crewMember.id,
                  schedule_type: 'monthly',
                  start_date: startDate.toISOString().split('T')[0],
                  end_date: endDate.toISOString().split('T')[0],
                  notes: `Schedule mensile ${monthDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}`
                })
                .then(() => {
                  schedulesCreated++;
                })
                .catch(() => {
                  // Ignora errori
                });
            }
          }
        }
      }
      console.log(`    ✅ Creati ${schedulesCreated} schedule per piloti`);
      
      // Recuperiamo conteggi finali
      const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });
      
      const { count: quotesCount } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true });
      
      const { count: flightLegsCount } = await supabase
        .from('flight_legs')
        .select('*', { count: 'exact', head: true });
      
      const { count: scheduleChangesCount } = await supabase
        .from('schedule_changes')
        .select('*', { count: 'exact', head: true });
      
      const { count: handlingRequestsCount } = await supabase
        .from('handling_requests')
        .select('*', { count: 'exact', head: true });
      
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      return {
        totalFlights: data.flights.length,
        totalMaintenance: data.maintenanceRecords.length,
        totalOilRecords: data.oilRecords.length,
        crewMembersWithData: existingCrewMembers.length,
        assignmentsCreated,
        statsCreated,
        hoursCreated,
        schedulesCreated,
        clientsCount: clientsCount || 0,
        quotesCount: quotesCount || 0,
        flightLegsCount: flightLegsCount || 0,
        scheduleChangesCount: scheduleChangesCount || 0,
        handlingRequestsCount: handlingRequestsCount || 0,
        messagesCount: messagesCount || 0
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance-records'] });
      queryClient.invalidateQueries({ queryKey: ['oil-consumption'] });
      queryClient.invalidateQueries({ queryKey: ['crew-flight-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['crew-statistics'] });
      
      toast.success(
        `Simulazione completata! ` +
        `${result.totalFlights} voli, ${result.totalMaintenance} manutenzioni, ${result.totalOilRecords} record olio. ` +
        `${result.clientsCount} clients, ${result.quotesCount} quotes, ${result.flightLegsCount} flight_legs. ` +
        `${result.scheduleChangesCount} schedule_changes, ${result.handlingRequestsCount} handling_requests, ${result.messagesCount} messages. ` +
        `${result.crewMembersWithData} crew members con dati associati (password: crew123). ` +
        `${result.assignmentsCreated} assegnazioni, ${result.statsCreated} statistiche, ${result.hoursCreated} record ore di volo, ${result.schedulesCreated} schedule.`
      );
    },
    onError: (error) => {
      console.error('Errore simulazione:', error);
      toast.error('Errore durante la simulazione: ' + error.message);
    }
  });
};
