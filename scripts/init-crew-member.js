#!/usr/bin/env node
/**
 * Script per creare un profilo crew member con dati associati per esplorare la dashboard
 * Esegui: node scripts/init-crew-member.js
 */

import { query, getClient } from '../server/database.js';
import { randomUUID } from 'crypto';

const CREW_EMAIL = 'crew.test@alidaunia.it';
const CREW_PASSWORD = 'TestCrew123!'; // Password per l'account auth (da creare manualmente)
const CREW_FIRST_NAME = 'Marco';
const CREW_LAST_NAME = 'Rossi';
const CREW_POSITION = 'captain'; // captain, first_officer, cabin_crew, mechanic
const CREW_PHONE = '+39 333 123 4567';
const CREW_LICENSE = 'LIC-12345';
const ORGANIZATION_NAME = 'Alidaunia'; // Nome dell'organizzazione esistente

async function initCrewMember() {
  const client = await getClient();
  
  try {
    console.log('👨‍✈️ Creazione profilo Crew Member con dati associati...');
    console.log(`   Email: ${CREW_EMAIL}`);
    console.log(`   Nome: ${CREW_FIRST_NAME} ${CREW_LAST_NAME}`);
    console.log(`   Posizione: ${CREW_POSITION}`);

    // 1. Trova o crea l'organizzazione
    console.log('\n🏢 Verificando organizzazione...');
    let orgResult = await query(
      'SELECT id, name FROM organizations WHERE name = $1',
      [ORGANIZATION_NAME]
    );

    let organizationId;
    if (orgResult.rows.length === 0) {
      console.log(`   Organizzazione "${ORGANIZATION_NAME}" non trovata, creazione...`);
      const newOrgResult = await query(
        `INSERT INTO organizations (name, slug, is_active, created_at, updated_at)
         VALUES ($1, $2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id, name`,
        [ORGANIZATION_NAME, ORGANIZATION_NAME.toLowerCase().replace(/\s+/g, '-')]
      );
      organizationId = newOrgResult.rows[0].id;
      console.log(`   ✅ Organizzazione creata: ${newOrgResult.rows[0].name} (${organizationId})`);
    } else {
      organizationId = orgResult.rows[0].id;
      console.log(`   ✅ Organizzazione trovata: ${orgResult.rows[0].name} (${organizationId})`);
    }

    // 2. Verifica se il crew member esiste già
    console.log('\n👤 Verificando crew member...');
    let crewResult = await query(
      'SELECT id, email, first_name, last_name, position FROM crew_members WHERE email = $1',
      [CREW_EMAIL]
    );

    let crewMemberId;
    if (crewResult.rows.length > 0) {
      crewMemberId = crewResult.rows[0].id;
      console.log(`   ✅ Crew member già esistente: ${crewResult.rows[0].first_name} ${crewResult.rows[0].last_name} (${crewMemberId})`);
      console.log(`   ⚠️  Aggiornando dati esistenti...`);
      
      // Aggiorna i dati del crew member
      await query(
        `UPDATE crew_members 
         SET first_name = $1, last_name = $2, position = $3, organization_id = $4, 
             license_number = $5, license_expiry = $6, is_active = true, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7`,
        [
          CREW_FIRST_NAME,
          CREW_LAST_NAME,
          CREW_POSITION,
          organizationId,
          CREW_LICENSE,
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 anno da oggi
          crewMemberId
        ]
      );
    } else {
      // Crea il crew member
      const newCrewResult = await query(
        `INSERT INTO crew_members (
          id, first_name, last_name, email, phone, position, organization_id,
          license_number, license_expiry, is_active, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, email, first_name, last_name`,
        [
          randomUUID(),
          CREW_FIRST_NAME,
          CREW_LAST_NAME,
          CREW_EMAIL,
          CREW_PHONE,
          CREW_POSITION,
          organizationId,
          CREW_LICENSE,
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 anno da oggi
        ]
      );
      crewMemberId = newCrewResult.rows[0].id;
      console.log(`   ✅ Crew member creato: ${newCrewResult.rows[0].first_name} ${newCrewResult.rows[0].last_name} (${crewMemberId})`);
    }

    // 3. Crea/aggiorna il profilo (senza auth_id per ora, verrà collegato quando crei l'account auth)
    console.log('\n📋 Verificando profilo...');
    let profileResult = await query(
      'SELECT id, email FROM profiles WHERE email = $1',
      [CREW_EMAIL]
    );

    if (profileResult.rows.length === 0) {
      await query(
        `INSERT INTO profiles (
          id, email, first_name, last_name, phone, organization_id, is_active, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          randomUUID(),
          CREW_EMAIL,
          CREW_FIRST_NAME,
          CREW_LAST_NAME,
          CREW_PHONE,
          organizationId
        ]
      );
      console.log(`   ✅ Profilo creato per ${CREW_EMAIL}`);
    } else {
      console.log(`   ✅ Profilo già esistente per ${CREW_EMAIL}`);
    }

    // 4. Recupera alcuni voli esistenti per assegnarli
    console.log('\n✈️  Recuperando voli esistenti...');
    const flightsResult = await query(
      `SELECT id, flight_number, departure_time, arrival_time, status 
       FROM flights 
       WHERE status IN ('scheduled', 'active')
       ORDER BY departure_time ASC
       LIMIT 20`
    );

    if (flightsResult.rows.length === 0) {
      console.log('   ⚠️  Nessun volo trovato. Esegui prima la simulazione per creare voli.');
    } else {
      console.log(`   ✅ Trovati ${flightsResult.rows.length} voli`);

      // 5. Crea flight assignments per i prossimi 10 voli
      console.log('\n📅 Creando assegnazioni voli...');
      let assignmentsCreated = 0;
      
      for (let i = 0; i < Math.min(10, flightsResult.rows.length); i++) {
        const flight = flightsResult.rows[i];
        const departureTime = new Date(flight.departure_time);
        const arrivalTime = new Date(flight.arrival_time);
        
        // Calcola le ore di volo
        const flightHours = (arrivalTime - departureTime) / (1000 * 60 * 60); // ore
        const dutyHours = flightHours + 0.5; // aggiungi 30 minuti per pre/post volo
        
        // Verifica se l'assegnazione esiste già
        const existingAssignment = await query(
          'SELECT id FROM crew_flight_assignments WHERE flight_id = $1 AND crew_member_id = $2',
          [flight.id, crewMemberId]
        );

        if (existingAssignment.rows.length === 0) {
          await query(
            `INSERT INTO crew_flight_assignments (
              id, flight_id, crew_member_id, position, 
              reporting_time, duty_start_time, duty_end_time,
              flight_time_hours, duty_time_hours, rest_time_hours,
              ftl_compliant, airport_recency_valid, currency_valid,
              certificates_valid, passport_valid, visa_valid,
              assigned_at, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, true, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
              randomUUID(),
              flight.id,
              crewMemberId,
              CREW_POSITION,
              new Date(departureTime.getTime() - 30 * 60 * 1000).toISOString(), // 30 min prima
              departureTime.toISOString(),
              new Date(arrivalTime.getTime() + 30 * 60 * 1000).toISOString(), // 30 min dopo
              parseFloat(flightHours.toFixed(2)),
              parseFloat(dutyHours.toFixed(2)),
              12.0 // 12 ore di riposo
            ]
          );
          assignmentsCreated++;
        }
      }
      console.log(`   ✅ Create ${assignmentsCreated} assegnazioni voli`);
    }

    // 6. Crea statistiche mensili per gli ultimi 6 mesi
    console.log('\n📊 Creando statistiche mensili...');
    const today = new Date();
    let statsCreated = 0;
    
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYear = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
      
      // Verifica se le statistiche esistono già
      const existingStats = await query(
        'SELECT id FROM crew_statistics WHERE crew_member_id = $1 AND month_year = $2',
        [crewMemberId, monthYear]
      );

      if (existingStats.rows.length === 0) {
        // Genera dati realistici
        const flightHours = Math.random() * 50 + 30; // 30-80 ore
        const flights = Math.floor(Math.random() * 20 + 10); // 10-30 voli
        const dutyHours = flightHours + (Math.random() * 20 + 10); // ore di servizio
        const nightHours = flightHours * 0.2; // 20% notturni
        const sectors = flights * 1.5; // circa 1.5 settori per volo
        
        await query(
          `INSERT INTO crew_statistics (
            id, crew_member_id, month_year,
            total_flights, total_sectors, total_flight_hours, total_duty_hours,
            night_hours, simulator_hours, training_hours, days_off,
            ftl_violations, performance_rating,
            created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [
            randomUUID(),
            crewMemberId,
            monthYear,
            flights,
            Math.floor(sectors),
            parseFloat(flightHours.toFixed(2)),
            parseFloat(dutyHours.toFixed(2)),
            parseFloat(nightHours.toFixed(2)),
            parseFloat((Math.random() * 5).toFixed(2)), // 0-5 ore simulatore
            parseFloat((Math.random() * 3).toFixed(2)), // 0-3 ore formazione
            Math.floor(Math.random() * 5 + 5), // 5-10 giorni liberi
            parseFloat((Math.random() * 2 + 8).toFixed(2)) // rating 8-10
          ]
        );
        statsCreated++;
      }
    }
    console.log(`   ✅ Create ${statsCreated} statistiche mensili`);

    // 7. Crea pilot_flight_hours per alcuni voli completati
    console.log('\n📝 Creando record ore di volo...');
    const completedFlightsResult = await query(
      `SELECT id, departure_time, arrival_time 
       FROM flights 
       WHERE status = 'completed'
       ORDER BY departure_time DESC
       LIMIT 15`
    );

    if (completedFlightsResult.rows.length > 0) {
      let hoursCreated = 0;
      for (const flight of completedFlightsResult.rows) {
        const departureTime = new Date(flight.departure_time);
        const arrivalTime = new Date(flight.arrival_time);
        const flightHours = (arrivalTime - departureTime) / (1000 * 60 * 60);
        
        // Verifica se esiste già
        const existingHours = await query(
          'SELECT id FROM pilot_flight_hours WHERE pilot_id = $1 AND flight_id = $2',
          [crewMemberId, flight.id]
        );

        if (existingHours.rows.length === 0) {
          await query(
            `INSERT INTO pilot_flight_hours (
              id, pilot_id, flight_id, flight_date, flight_type, flight_hours,
              created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
              randomUUID(),
              crewMemberId,
              flight.id,
              departureTime.toISOString().split('T')[0],
              'commercial',
              parseFloat(flightHours.toFixed(2))
            ]
          );
          hoursCreated++;
        }
      }
      console.log(`   ✅ Creati ${hoursCreated} record ore di volo`);
    } else {
      console.log('   ⚠️  Nessun volo completato trovato');
    }

    console.log('\n✅ Profilo crew member creato con successo!');
    console.log('\n📋 Credenziali per l\'accesso:');
    console.log(`   Email: ${CREW_EMAIL}`);
    console.log(`   Password: ${CREW_PASSWORD}`);
    console.log('\n⚠️  IMPORTANTE: Devi ancora creare l\'account di autenticazione!');
    console.log('   Vai su /auth e registrati con queste credenziali, oppure usa l\'interfaccia admin per creare l\'account.');
    console.log(`   Una volta creato l'account auth, il profilo sarà collegato automaticamente tramite l'email.`);
    console.log(`\n   URL Dashboard: /crew-dashboard`);

  } catch (error) {
    console.error('❌ Errore durante la creazione del crew member:', error);
    console.error('   Dettagli:', error.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

initCrewMember();

