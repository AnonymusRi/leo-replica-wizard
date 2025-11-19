
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
    
    // Simuliamo 6 mesi: 3 mesi passati + 3 mesi futuri
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const threeMonthsFromNow = new Date(today);
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    
    const startDate = new Date(threeMonthsAgo);
    startDate.setDate(1); // Primo giorno del mese
    const endDate = new Date(threeMonthsFromNow);
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
      
      // Missioni di elisoccorso (casuali, 2-8 al giorno)
      const rescueMissions = Math.floor(Math.random() * 7) + 2;
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
      console.log('Iniziando simulazione dati per 5 mesi...');
      
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

      // Creiamo dati associati per ogni crew member (assegnazioni voli, statistiche, ore di volo)
      console.log('\n📊 Creando dati associati per crew members...');
      
      // 1. Assegnazioni voli per ogni crew member
      console.log('  📅 Creando assegnazioni voli...');
      const allFlights = data.flights;
      let assignmentsCreated = 0;
      
      for (const crewMember of existingCrewMembers) {
        // Assegna 5-15 voli casuali a ogni crew member
        const numAssignments = Math.floor(Math.random() * 11) + 5;
        const selectedFlights = allFlights
          .sort(() => Math.random() - 0.5)
          .slice(0, numAssignments);
        
        for (const flight of selectedFlights) {
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
      console.log(`    ✅ Create ${assignmentsCreated} assegnazioni voli`);
      
      // 2. Statistiche mensili per ogni crew member (ultimi 6 mesi)
      console.log('  📊 Creando statistiche mensili...');
      const today = new Date();
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
      
      // 3. Record ore di volo per voli completati
      console.log('  📝 Creando record ore di volo...');
      const completedFlights = allFlights.filter(f => f.status === 'completed');
      let hoursCreated = 0;
      
      for (const crewMember of existingCrewMembers) {
        if (crewMember.position === 'captain' || crewMember.position === 'first_officer') {
          // Solo piloti hanno record ore di volo
          const numRecords = Math.floor(Math.random() * 10) + 5;
          const selectedFlights = completedFlights
            .sort(() => Math.random() - 0.5)
            .slice(0, numRecords);
          
          for (const flight of selectedFlights) {
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
            
            // Verifica che flightHours sia un numero valido
            if (isNaN(flightHours) || !isFinite(flightHours) || flightHours <= 0) {
              continue; // Salta calcoli non validi
            }
            
            // Verifica se esiste già
            const { data: existingHours } = await supabase
              .from('pilot_flight_hours')
              .select('id')
              .eq('pilot_id', crewMember.id)
              .eq('flight_id', flight.id)
              .maybeSingle();
            
            if (!existingHours) {
              await supabase
                .from('pilot_flight_hours')
                .insert({
                  pilot_id: crewMember.id,
                  flight_id: flight.id,
                  flight_date: departureTime.toISOString().split('T')[0],
                  flight_type: 'commercial',
                  flight_hours: parseFloat(Number(flightHours).toFixed(2))
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
      }
      console.log(`    ✅ Creati ${hoursCreated} record ore di volo`);
      
      return {
        totalFlights: data.flights.length,
        totalMaintenance: data.maintenanceRecords.length,
        totalOilRecords: data.oilRecords.length,
        crewMembersWithData: existingCrewMembers.length,
        assignmentsCreated,
        statsCreated,
        hoursCreated
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance-records'] });
      queryClient.invalidateQueries({ queryKey: ['oil-consumption'] });
      queryClient.invalidateQueries({ queryKey: ['crew-flight-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['crew-statistics'] });
      
      toast.success(
        `Simulazione completata! ${result.totalFlights} voli, ${result.totalMaintenance} manutenzioni, ${result.totalOilRecords} record olio. ` +
        `${result.crewMembersWithData} crew members con dati associati (password: crew123). ` +
        `${result.assignmentsCreated} assegnazioni, ${result.statsCreated} statistiche, ${result.hoursCreated} record ore di volo.`
      );
    },
    onError: (error) => {
      console.error('Errore simulazione:', error);
      toast.error('Errore durante la simulazione: ' + error.message);
    }
  });
};
