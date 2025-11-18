// PostgreSQL Client - Migrated from Supabase
// This file now uses PostgreSQL instead of Supabase
import { postgres } from '../postgres/client';
import type { Database } from './types';

// Import the database client like this:
// import { supabase } from "@/integrations/supabase/client";
// The 'supabase' export is now a PostgreSQL-compatible wrapper

// Export as 'supabase' for backward compatibility with existing code
export const supabase = postgres;