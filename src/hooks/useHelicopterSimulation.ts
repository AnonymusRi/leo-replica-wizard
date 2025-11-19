
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
            recorded_by: 'Meccanico di turno'
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
        .select('id, name');
      
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
          .select('id, name');
        
        if (orgError) {
          console.error('❌ Errore creazione organizzazioni:', orgError);
          throw orgError;
        }
        organizations = newOrgs;
        console.log(`✅ Create ${organizations.length} organizzazioni`);
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
      
      const data = generateSimulationData();
      
      // Prima recuperiamo gli ID degli elicotteri e crew
      const { data: aircraft } = await supabase
        .from('aircraft')
        .select('id, tail_number')
        .eq('aircraft_type', 'helicopter');
      
      const { data: existingCrewMembers } = await supabase
        .from('crew_members')
        .select('id, position, first_name, last_name');
      
      if (!aircraft || aircraft.length === 0) {
        throw new Error('Nessun elicottero trovato. Crea prima gli elicotteri.');
      }
      
      if (!existingCrewMembers || existingCrewMembers.length === 0) {
        throw new Error('Nessun crew member trovato. I crew members sono stati creati sopra.');
      }
      
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
      
      // Assegniamo aircraft_id ai record olio
      data.oilRecords.forEach(record => {
        record.aircraft_id = aircraft[Math.floor(Math.random() * aircraft.length)]?.id;
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
      
      return {
        totalFlights: data.flights.length,
        totalMaintenance: data.maintenanceRecords.length,
        totalOilRecords: data.oilRecords.length
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance-records'] });
      queryClient.invalidateQueries({ queryKey: ['oil-consumption'] });
      
      toast.success(
        `Simulazione completata! ${result.totalFlights} voli, ${result.totalMaintenance} manutenzioni, ${result.totalOilRecords} record olio generati`
      );
    },
    onError: (error) => {
      console.error('Errore simulazione:', error);
      toast.error('Errore durante la simulazione: ' + error.message);
    }
  });
};
