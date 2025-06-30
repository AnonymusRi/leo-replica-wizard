
// Sistema completo di permessi per la piattaforma SaaS
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
  level: PermissionLevel;
}

export type PermissionCategory = 
  | 'platform'      // Gestione piattaforma
  | 'organization'  // Gestione organizzazione 
  | 'aircraft'      // Gestione aeromobili
  | 'crew'          // Gestione equipaggio
  | 'schedule'      // Gestione scheduling
  | 'ops'           // Operazioni di volo
  | 'maintenance'   // Manutenzione
  | 'sales'         // Vendite e quotazioni
  | 'phonebook'     // Rubrica
  | 'reports'       // Report e analisi
  | 'owner_board'   // Dashboard proprietari
  | 'billing'       // Fatturazione
  | 'settings';     // Impostazioni

export type PermissionLevel = 
  | 'view'          // Solo visualizzazione
  | 'create'        // Creazione nuovi elementi
  | 'edit'          // Modifica elementi esistenti
  | 'delete'        // Eliminazione elementi
  | 'approve'       // Approvazione workflow
  | 'admin'         // Amministrazione completa
  | 'super_admin';  // Super amministrazione

export type PermissionAction = 
  | 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'import'
  | 'assign' | 'unassign' | 'publish' | 'unpublish' | 'archive' | 'restore'
  | 'send_email' | 'generate_report' | 'manage_settings' | 'manage_users'
  | 'manage_billing' | 'manage_subscription';

// Definizione completa dei permessi per modulo
export interface ModulePermissions {
  // PLATFORM - Solo Super Admin
  platform: {
    manage_organizations: boolean;      // Creare/eliminare organizzazioni
    manage_subscriptions: boolean;     // Gestire abbonamenti clienti
    view_all_data: boolean;           // Accesso a tutti i dati
    platform_settings: boolean;       // Impostazioni globali
    platform_billing: boolean;        // Fatturazione piattaforma
  };

  // ORGANIZATION - Organization Admin e Super Admin
  organization: {
    view_organization: boolean;        // Visualizzare dati organizzazione
    edit_organization: boolean;        // Modificare dati organizzazione
    manage_users: boolean;            // Gestire utenti organizzazione
    manage_roles: boolean;            // Assegnare ruoli
    view_billing: boolean;            // Vedere fatturazione
    manage_subscription: boolean;     // Gestire abbonamento
    organization_settings: boolean;   // Impostazioni organizzazione
  };

  // AIRCRAFT - Module Admin, Organization Admin, Super Admin
  aircraft: {
    view_aircraft: boolean;           // Visualizzare aeromobili
    create_aircraft: boolean;         // Aggiungere aeromobili
    edit_aircraft: boolean;           // Modificare aeromobili
    delete_aircraft: boolean;         // Eliminare aeromobili
    manage_documents: boolean;        // Gestire documenti
    view_maintenance: boolean;        // Vedere manutenzioni
    manage_certifications: boolean;   // Gestire certificazioni
    export_data: boolean;            // Esportare dati
  };

  // CREW - Module Admin, Organization Admin, Super Admin
  crew: {
    view_crew: boolean;              // Visualizzare equipaggio
    create_crew: boolean;            // Aggiungere membri
    edit_crew: boolean;              // Modificare membri
    delete_crew: boolean;            // Eliminare membri
    manage_qualifications: boolean;  // Gestire qualifiche
    manage_schedule: boolean;        // Gestire pianificazione
    view_ftl_compliance: boolean;    // Vedere conformità FTL
    manage_training: boolean;        // Gestire training
    assign_flights: boolean;         // Assegnare voli
  };

  // SCHEDULE - Module Admin, Organization Admin, Super Admin
  schedule: {
    view_schedule: boolean;          // Visualizzare schedule
    create_flights: boolean;         // Creare voli
    edit_flights: boolean;           // Modificare voli
    delete_flights: boolean;         // Eliminare voli
    publish_schedule: boolean;       // Pubblicare schedule
    manage_versions: boolean;        // Gestire versioni
    export_schedule: boolean;        // Esportare schedule
    approve_changes: boolean;        // Approvare modifiche
  };

  // OPS - Module Admin, Organization Admin, Super Admin
  ops: {
    view_operations: boolean;        // Visualizzare operazioni
    manage_checklists: boolean;      // Gestire checklist
    generate_documents: boolean;     // Generare documenti
    manage_handling: boolean;        // Gestire handling
    view_notifications: boolean;     // Vedere notifiche
    force_assignments: boolean;      // Forzare assegnazioni
    ops_approval: boolean;          // Approvazioni operative
  };

  // MAINTENANCE - Module Admin, Organization Admin, Super Admin
  maintenance: {
    view_maintenance: boolean;       // Visualizzare manutenzioni
    create_maintenance: boolean;     // Creare manutenzioni
    edit_maintenance: boolean;       // Modificare manutenzioni
    approve_maintenance: boolean;    // Approvare manutenzioni
    manage_hold_items: boolean;      // Gestire hold items
    view_oil_consumption: boolean;   // Vedere consumo olio
    maintenance_settings: boolean;   // Impostazioni manutenzione
  };

  // SALES - Module Admin, Organization Admin, Super Admin
  sales: {
    view_quotes: boolean;           // Visualizzare quotazioni
    create_quotes: boolean;         // Creare quotazioni
    edit_quotes: boolean;           // Modificare quotazioni
    delete_quotes: boolean;         // Eliminare quotazioni
    manage_clients: boolean;        // Gestire clienti
    send_quotes: boolean;           // Inviare quotazioni
    approve_quotes: boolean;        // Approvare quotazioni
    view_marketplace: boolean;      // Vedere marketplace
    manage_pricing: boolean;        // Gestire prezzi
  };

  // PHONEBOOK - Tutti gli utenti
  phonebook: {
    view_contacts: boolean;         // Visualizzare contatti
    create_contacts: boolean;       // Creare contatti
    edit_contacts: boolean;         // Modificare contatti
    delete_contacts: boolean;       // Eliminare contatti
    export_contacts: boolean;       // Esportare contatti
  };

  // REPORTS - Module Admin, Organization Admin, Super Admin
  reports: {
    view_reports: boolean;          // Visualizzare report
    generate_reports: boolean;      // Generare report
    export_reports: boolean;        // Esportare report
    schedule_reports: boolean;      // Programmare report
    custom_reports: boolean;        // Report personalizzati
  };

  // OWNER_BOARD - Organization Admin, Super Admin
  owner_board: {
    view_dashboard: boolean;        // Visualizzare dashboard
    financial_data: boolean;        // Dati finanziari
    performance_metrics: boolean;   // Metriche performance
    fleet_overview: boolean;        // Panoramica flotta
    crew_overview: boolean;         // Panoramica equipaggio
  };
}

// Preset di permessi per ruolo
export const ROLE_PERMISSIONS: Record<string, Partial<ModulePermissions>> = {
  super_admin: {
    platform: {
      manage_organizations: true,
      manage_subscriptions: true,
      view_all_data: true,
      platform_settings: true,
      platform_billing: true,
    },
    organization: {
      view_organization: true,
      edit_organization: true,
      manage_users: true,
      manage_roles: true,
      view_billing: true,
      manage_subscription: true,
      organization_settings: true,
    },
    // Tutti gli altri moduli con permessi completi
    aircraft: {
      view_aircraft: true,
      create_aircraft: true,
      edit_aircraft: true,
      delete_aircraft: true,
      manage_documents: true,
      view_maintenance: true,
      manage_certifications: true,
      export_data: true,
    },
    // ... (continua per tutti i moduli)
  },

  organization_admin: {
    organization: {
      view_organization: true,
      edit_organization: true,
      manage_users: true,
      manage_roles: true,
      view_billing: true,
      manage_subscription: true,
      organization_settings: true,
    },
    aircraft: {
      view_aircraft: true,
      create_aircraft: true,
      edit_aircraft: true,
      delete_aircraft: true,
      manage_documents: true,
      view_maintenance: true,
      manage_certifications: true,
      export_data: true,
    },
    crew: {
      view_crew: true,
      create_crew: true,
      edit_crew: true,
      delete_crew: true,
      manage_qualifications: true,
      manage_schedule: true,
      view_ftl_compliance: true,
      manage_training: true,
      assign_flights: true,
    },
    // ... (continua per tutti i moduli operativi)
  },

  module_admin: {
    // Permessi specifici per il modulo assegnato
    // Verranno definiti dinamicamente in base al modulo
  },

  user: {
    // Permessi base per utenti standard
    phonebook: {
      view_contacts: true,
      create_contacts: true,
      edit_contacts: false,
      delete_contacts: false,
      export_contacts: false,
    },
    aircraft: {
      view_aircraft: true,
      create_aircraft: false,
      edit_aircraft: false,
      delete_aircraft: false,
      manage_documents: false,
      view_maintenance: true,
      manage_certifications: false,
      export_data: false,
    },
  },

  crew_member: {
    // Permessi per piloti e equipaggio
    schedule: {
      view_schedule: true,
      create_flights: false,
      edit_flights: false,
      delete_flights: false,
      publish_schedule: false,
      manage_versions: false,
      export_schedule: true,
      approve_changes: false,
    },
    ops: {
      view_operations: true,
      manage_checklists: false,
      generate_documents: false,
      manage_handling: false,
      view_notifications: true,
      force_assignments: false,
      ops_approval: false,
    },
  },
};

// Funzioni helper per la gestione dei permessi
export const hasPermission = (
  userRoles: string[],
  module: keyof ModulePermissions,
  action: string
): boolean => {
  return userRoles.some(role => {
    const rolePermissions = ROLE_PERMISSIONS[role];
    return rolePermissions?.[module]?.[action as keyof any] === true;
  });
};

export const getModulePermissions = (
  userRoles: string[],
  module: keyof ModulePermissions
): any => {
  const permissions = {};
  
  userRoles.forEach(role => {
    const rolePermissions = ROLE_PERMISSIONS[role];
    if (rolePermissions?.[module]) {
      Object.assign(permissions, rolePermissions[module]);
    }
  });
  
  return permissions;
};

export const canAccessModule = (
  userRoles: string[],
  module: keyof ModulePermissions
): boolean => {
  return userRoles.some(role => {
    const rolePermissions = ROLE_PERMISSIONS[role];
    return rolePermissions?.[module] && 
           Object.values(rolePermissions[module]).some(permission => permission === true);
  });
};
