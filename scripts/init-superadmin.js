#!/usr/bin/env node

/**
 * Script per inizializzare il SuperAdmin
 * Esegui: node scripts/init-superadmin.js
 */

import { query } from '../server/database.js';

const SUPERADMIN_EMAIL = 'riccardo.cirulli@gmail.com';
const SUPERADMIN_PHONE = '+39 123 456 7890';

async function initSuperAdmin() {
  try {
    console.log('🔐 Inizializzazione SuperAdmin...');
    console.log(`   Email: ${SUPERADMIN_EMAIL}`);

    // Verifica se esiste già
    const checkResult = await query(
      'SELECT id, email, is_active FROM super_admins WHERE email = $1',
      [SUPERADMIN_EMAIL]
    );

    if (checkResult.rows.length > 0) {
      const existing = checkResult.rows[0];
      console.log('✅ SuperAdmin già esistente:');
      console.log(`   ID: ${existing.id}`);
      console.log(`   Email: ${existing.email}`);
      console.log(`   Attivo: ${existing.is_active}`);
      
      // Aggiorna se necessario
      if (!existing.is_active) {
        await query(
          'UPDATE super_admins SET is_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
          [existing.id]
        );
        console.log('✅ SuperAdmin attivato');
      }
      return;
    }

    // Crea il SuperAdmin
    const insertResult = await query(
      `INSERT INTO super_admins (email, phone_number, is_active, two_factor_enabled, created_at, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, email, is_active`,
      [SUPERADMIN_EMAIL, SUPERADMIN_PHONE, true, false]
    );

    if (insertResult.rows.length > 0) {
      const newAdmin = insertResult.rows[0];
      console.log('✅ SuperAdmin creato con successo:');
      console.log(`   ID: ${newAdmin.id}`);
      console.log(`   Email: ${newAdmin.email}`);
      console.log(`   Attivo: ${newAdmin.is_active}`);
    } else {
      console.error('❌ Errore: SuperAdmin non creato');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Errore durante l\'inizializzazione del SuperAdmin:', error);
    console.error('   Dettagli:', error.message);
    process.exit(1);
  }
}

initSuperAdmin();

