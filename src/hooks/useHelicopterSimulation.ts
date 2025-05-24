
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
    
    const startDate = new Date('2024-08-01');
    const endDate = new Date('2024-12-31');
    
    // Simuliamo 5 mesi di operazioni
    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
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
          status: date < new Date() ? 'completed' : 'scheduled',
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
          status: date < new Date() ? 'completed' : 'scheduled',
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
          status: date < new Date() ? 'completed' : 'scheduled',
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
          status: date < new Date() ? 'completed' : 'scheduled',
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
          status: date < new Date() ? 'completed' : 'scheduled',
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
          completed_date: date < new Date() ? format(addHours(startOfDay(date), 10), 'yyyy-MM-dd HH:mm:ss') : null,
          status: date < new Date() ? 'completed' : 'scheduled',
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
      
      const data = generateSimulationData();
      
      // Prima recuperiamo gli ID degli elicotteri e crew
      const { data: aircraft } = await supabase
        .from('aircraft')
        .select('id, tail_number')
        .eq('aircraft_type', 'helicopter');
      
      const { data: crewMembers } = await supabase
        .from('crew_members')
        .select('id, position, first_name, last_name');
      
      if (!aircraft || !crewMembers) {
        throw new Error('Impossibile recuperare dati base');
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
        const mechanics = crewMembers.filter(c => c.position === 'mechanic');
        record.technician_id = mechanics[Math.floor(Math.random() * mechanics.length)]?.id;
      });
      
      // Assegniamo aircraft_id ai record olio
      data.oilRecords.forEach(record => {
        record.aircraft_id = aircraft[Math.floor(Math.random() * aircraft.length)]?.id;
      });
      
      // Inseriamo i dati nel database in batch
      console.log(`Inserendo ${data.flights.length} voli...`);
      const { error: flightsError } = await supabase
        .from('flights')
        .insert(data.flights);
      
      if (flightsError) {
        console.error('Errore inserimento voli:', flightsError);
        throw flightsError;
      }
      
      console.log(`Inserendo ${data.maintenanceRecords.length} record manutenzione...`);
      const { error: maintenanceError } = await supabase
        .from('maintenance_records')
        .insert(data.maintenanceRecords);
      
      if (maintenanceError) {
        console.error('Errore inserimento manutenzioni:', maintenanceError);
        throw maintenanceError;
      }
      
      console.log(`Inserendo ${data.oilRecords.length} record consumo olio...`);
      const { error: oilError } = await supabase
        .from('oil_consumption_records')
        .insert(data.oilRecords);
      
      if (oilError) {
        console.error('Errore inserimento record olio:', oilError);
        throw oilError;
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
