// PostgreSQL Client - Supabase-compatible wrapper
// This provides a similar API to Supabase for easier migration

import { query, getClient } from '@/config/database';
import type { Database } from '../supabase/types';

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Helper to convert PostgreSQL rows to Supabase-like format
function formatRows(rows: any[]) {
  return rows.map(row => {
    const formatted: any = {};
    for (const [key, value] of Object.entries(row)) {
      // Convert snake_case to camelCase if needed
      formatted[key] = value;
    }
    return formatted;
  });
}

// Supabase-like query builder
class PostgresQueryBuilder {
  private tableName: string;
  private selectFields: string = '*';
  private whereConditions: { field: string; operator: string; value: any }[] = [];
  private orderByField: string | null = null;
  private orderByDirection: 'asc' | 'desc' = 'asc';
  private limitCount: number | null = null;
  private offsetCount: number | null = null;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(fields: string) {
    this.selectFields = fields;
    return this;
  }

  eq(field: string, value: any) {
    this.whereConditions.push({ field, operator: '=', value });
    return this;
  }

  neq(field: string, value: any) {
    this.whereConditions.push({ field, operator: '!=', value });
    return this;
  }

  gt(field: string, value: any) {
    this.whereConditions.push({ field, operator: '>', value });
    return this;
  }

  gte(field: string, value: any) {
    this.whereConditions.push({ field, operator: '>=', value });
    return this;
  }

  lt(field: string, value: any) {
    this.whereConditions.push({ field, operator: '<', value });
    return this;
  }

  lte(field: string, value: any) {
    this.whereConditions.push({ field, operator: '<=', value });
    return this;
  }

  like(field: string, pattern: string) {
    this.whereConditions.push({ field, operator: 'LIKE', value: pattern });
    return this;
  }

  ilike(field: string, pattern: string) {
    this.whereConditions.push({ field, operator: 'ILIKE', value: pattern });
    return this;
  }

  in(field: string, values: any[]) {
    this.whereConditions.push({ field, operator: 'IN', value: values });
    return this;
  }

  is(field: string, value: any) {
    this.whereConditions.push({ field, operator: 'IS', value });
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderByField = field;
    this.orderByDirection = options?.ascending === false ? 'desc' : 'asc';
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  range(from: number, to: number) {
    this.offsetCount = from;
    this.limitCount = to - from + 1;
    return this;
  }

  private buildQuery(): { sql: string; params: any[] } {
    let sql = `SELECT ${this.selectFields} FROM ${this.tableName}`;
    const params: any[] = [];
    let paramIndex = 1;

    // Build WHERE clause
    if (this.whereConditions.length > 0) {
      const conditions = this.whereConditions.map(cond => {
        if (cond.operator === 'IN') {
          const placeholders = cond.value.map(() => `$${paramIndex++}`).join(', ');
          params.push(...cond.value);
          return `${cond.field} IN (${placeholders})`;
        } else {
          params.push(cond.value);
          return `${cond.field} ${cond.operator} $${paramIndex++}`;
        }
      });
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Build ORDER BY clause
    if (this.orderByField) {
      sql += ` ORDER BY ${this.orderByField} ${this.orderByDirection.toUpperCase()}`;
    }

    // Build LIMIT clause
    if (this.limitCount !== null) {
      sql += ` LIMIT ${this.limitCount}`;
    }

    // Build OFFSET clause
    if (this.offsetCount !== null) {
      sql += ` OFFSET ${this.offsetCount}`;
    }

    return { sql, params };
  }

  async execute() {
    // In browser, return mock data
    if (isBrowser) {
      console.warn('⚠️ Database query executed in browser - returning mock data');
      return this.executeMock();
    }

    const { sql, params } = this.buildQuery();
    try {
      const result = await query(sql, params);
      return {
        data: formatRows(result.rows),
        error: null,
        count: result.rowCount,
      };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code,
          details: error.detail,
        },
        count: null,
      };
    }
  }

  // Mock data for browser environment
  private executeMock() {
    // Mock data based on table name and conditions
    const mockData: any = {
      super_admins: [
        {
          id: '1',
          email: 'riccardo.cirulli@gmail.com',
          phone_number: '+39 123 456 7890',
          is_active: true,
          two_factor_enabled: false,
          user_id: 'mock-user-id',
          created_at: new Date().toISOString(),
        }
      ],
      users: [],
      organizations: [],
      flights: [],
      crew_members: [],
      aircraft_hold_items: [],
      aircraft_documents: [],
      crew_flight_assignments: [],
      training_records: [],
      pilot_flight_hours: [],
    };

    let data = mockData[this.tableName] || [];
    
    // Apply filters
    for (const condition of this.whereConditions) {
      if (condition.operator === '=') {
        data = data.filter((row: any) => {
          const rowValue = row[condition.field];
          const conditionValue = condition.value;
          // Handle case-insensitive string comparison
          if (typeof rowValue === 'string' && typeof conditionValue === 'string') {
            return rowValue.toLowerCase() === conditionValue.toLowerCase();
          }
          return rowValue === conditionValue;
        });
      }
    }

    // Apply limit
    if (this.limitCount !== null) {
      data = data.slice(0, this.limitCount);
    }

    return {
      data: formatRows(data),
      error: null,
      count: data.length,
    };
  }

  // Supabase-compatible methods: single() - returns first row or throws if not found
  async single() {
    const result = await this.execute();
    if (result.error) {
      throw result.error;
    }
    if (!result.data || result.data.length === 0) {
      // In browser with mock data, return null instead of throwing
      if (isBrowser) {
        console.warn('⚠️ single() called but no data found - returning null (browser mock)');
        return {
          data: null,
          error: null,
        };
      }
      throw new Error('No rows returned');
    }
    if (result.data.length > 1) {
      throw new Error('Multiple rows returned, expected single row');
    }
    return {
      data: result.data[0],
      error: null,
    };
  }

  // Supabase-compatible methods: maybeSingle() - returns first row or null if not found
  async maybeSingle() {
    const result = await this.execute();
    if (result.error) {
      throw result.error;
    }
    if (!result.data || result.data.length === 0) {
      return {
        data: null,
        error: null,
      };
    }
    if (result.data.length > 1) {
      throw new Error('Multiple rows returned, expected single row');
    }
    return {
      data: result.data[0],
      error: null,
    };
  }

  // Insert method - returns a chainable object
  insert(data: any | any[]) {
    return new InsertBuilder(this.tableName, data);
  }

  // Update method - returns a chainable object
  update(data: any) {
    return new UpdateBuilder(this.tableName, data, this.whereConditions);
  }

  // Supabase-compatible methods
  async then(resolve?: any, reject?: any) {
    const result = await this.execute();
    if (result.error) {
      if (reject) reject(result.error);
      return Promise.reject(result.error);
    }
    if (resolve) resolve(result);
    return Promise.resolve(result);
  }
}

// Insert builder for chaining .insert().select().single()
class InsertBuilder {
  private tableName: string;
  private insertData: any | any[];
  private selectFields: string = '*';

  constructor(tableName: string, data: any | any[]) {
    this.tableName = tableName;
    this.insertData = data;
  }

  select(fields?: string) {
    if (fields) {
      this.selectFields = fields;
    }
    return this;
  }

  async single() {
    return await this.execute(true);
  }

  async maybeSingle() {
    return await this.execute(true);
  }

  async then(resolve?: any, reject?: any) {
    const result = await this.execute(false);
    if (result.error) {
      if (reject) reject(result.error);
      return Promise.reject(result.error);
    }
    if (resolve) resolve(result);
    return Promise.resolve(result);
  }

  private async execute(returnSingle: boolean = false) {
    // In browser, return mock data
    if (isBrowser) {
      console.warn('⚠️ Database insert executed in browser - returning mock data');
      return this.executeMock(returnSingle);
    }

    const rows = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
    const columns = Object.keys(rows[0]);
    const placeholders = rows.map((_, rowIndex) => {
      const rowPlaceholders = columns.map((_, colIndex) => 
        `$${rowIndex * columns.length + colIndex + 1}`
      ).join(', ');
      return `(${rowPlaceholders})`;
    }).join(', ');

    const values = rows.flatMap(row => columns.map(col => row[col]));
    const sql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES ${placeholders} RETURNING ${this.selectFields}`;
    
    try {
      const result = await query(sql, values);
      const formattedData = formatRows(result.rows);
      
      if (returnSingle) {
        if (formattedData.length === 0) {
          return { data: null, error: null };
        }
        return {
          data: formattedData[0],
          error: null,
        };
      }
      
      return {
        data: formattedData,
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }
  }

  private executeMock(returnSingle: boolean) {
    const rows = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
    const mockData = rows.map((row, index) => ({
      id: `mock-${Date.now()}-${index}`,
      ...row,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    if (returnSingle) {
      return {
        data: mockData[0] || null,
        error: null,
      };
    }

    return {
      data: mockData,
      error: null,
    };
  }
}

// Update builder for chaining .update().eq().select().single()
class UpdateBuilder {
  private tableName: string;
  private updateData: any;
  private whereConditions: { field: string; operator: string; value: any }[];
  private selectFields: string = '*';

  constructor(tableName: string, data: any, whereConditions: { field: string; operator: string; value: any }[]) {
    this.tableName = tableName;
    this.updateData = data;
    this.whereConditions = whereConditions;
  }

  eq(field: string, value: any) {
    this.whereConditions.push({ field, operator: '=', value });
    return this;
  }

  select(fields?: string) {
    if (fields) {
      this.selectFields = fields;
    }
    return this;
  }

  async single() {
    return await this.execute(true);
  }

  async maybeSingle() {
    return await this.execute(true);
  }

  async then(resolve?: any, reject?: any) {
    const result = await this.execute(false);
    if (result.error) {
      if (reject) reject(result.error);
      return Promise.reject(result.error);
    }
    if (resolve) resolve(result);
    return Promise.resolve(result);
  }

  private async execute(returnSingle: boolean = false) {
    // In browser, return mock data
    if (isBrowser) {
      console.warn('⚠️ Database update executed in browser - returning mock data');
      return this.executeMock(returnSingle);
    }

    const setClause = Object.keys(this.updateData).map((key, index) => 
      `${key} = $${index + 1}`
    ).join(', ');
    
    const whereClause = this.whereConditions.map((cond, index) => 
      `${cond.field} = $${Object.keys(this.updateData).length + index + 1}`
    ).join(' AND ');

    const values = [...Object.values(this.updateData), ...this.whereConditions.map(c => c.value)];
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${whereClause} RETURNING ${this.selectFields}`;

    try {
      const result = await query(sql, values);
      const formattedData = formatRows(result.rows);
      
      if (returnSingle) {
        if (formattedData.length === 0) {
          return { data: null, error: null };
        }
        return {
          data: formattedData[0],
          error: null,
        };
      }
      
      return {
        data: formattedData,
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }
  }

  private executeMock(returnSingle: boolean) {
    // Mock update - return updated data
    const mockData = {
      id: 'mock-id',
      ...this.updateData,
      updated_at: new Date().toISOString(),
    };

    if (returnSingle) {
      return {
        data: mockData,
        error: null,
      };
    }

    return {
      data: [mockData],
      error: null,
    };
  }
}

// Supabase-like client interface
class PostgresClient {
  from<T = any>(tableName: string) {
    return new PostgresQueryBuilder(tableName) as any;
  }

  // Supabase-compatible table method
  table<T = any>(tableName: string) {
    return this.from<T>(tableName);
  }

  // Insert method
  async insert(tableName: string, data: any | any[]) {
    const rows = Array.isArray(data) ? data : [data];
    const columns = Object.keys(rows[0]);
    const placeholders = rows.map((_, rowIndex) => {
      const rowPlaceholders = columns.map((_, colIndex) => 
        `$${rowIndex * columns.length + colIndex + 1}`
      ).join(', ');
      return `(${rowPlaceholders})`;
    }).join(', ');

    const values = rows.flatMap(row => columns.map(col => row[col]));
    const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${placeholders} RETURNING *`;
    
    try {
      const result = await query(sql, values);
      return {
        data: formatRows(result.rows),
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }
  }

  // Update method
  async update(tableName: string, data: any, conditions: { field: string; value: any }[]) {
    const setClause = Object.keys(data).map((key, index) => 
      `${key} = $${index + 1}`
    ).join(', ');
    
    const whereClause = conditions.map((cond, index) => 
      `${cond.field} = $${Object.keys(data).length + index + 1}`
    ).join(' AND ');

    const values = [...Object.values(data), ...conditions.map(c => c.value)];
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause} RETURNING *`;

    try {
      const result = await query(sql, values);
      return {
        data: formatRows(result.rows),
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }
  }

  // Delete method
  async delete(tableName: string, conditions: { field: string; value: any }[]) {
    const whereClause = conditions.map((cond, index) => 
      `${cond.field} = $${index + 1}`
    ).join(' AND ');

    const values = conditions.map(c => c.value);
    const sql = `DELETE FROM ${tableName} WHERE ${whereClause} RETURNING *`;

    try {
      const result = await query(sql, values);
      return {
        data: formatRows(result.rows),
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }
  }

  // Auth methods (mock for browser, real implementation for server)
  auth = {
    getUser: async () => {
      if (isBrowser) {
        // Mock user from localStorage
        const userStr = localStorage.getItem('mock_user');
        const user = userStr ? JSON.parse(userStr) : null;
        return { data: { user }, error: null };
      }
      // Server-side: implement your auth logic here
      return { data: { user: null }, error: null };
    },
    signUp: async (credentials: { email: string; password: string }) => {
      if (isBrowser) {
        // Mock signup - store in localStorage
        const mockUser = {
          id: 'mock-' + Date.now(),
          email: credentials.email,
          created_at: new Date().toISOString(),
        };
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        localStorage.setItem('mock_session', JSON.stringify({ access_token: 'mock-token' }));
        return { 
          data: { user: mockUser, session: { access_token: 'mock-token' } }, 
          error: null 
        };
      }
      // Server-side: implement your auth logic here
      return { data: { user: null, session: null }, error: null };
    },
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      if (isBrowser) {
        // Mock signin - store in localStorage
        const mockUser = {
          id: 'mock-user-id',
          email: credentials.email,
          created_at: new Date().toISOString(),
        };
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        localStorage.setItem('mock_session', JSON.stringify({ access_token: 'mock-token' }));
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { 
          data: { user: mockUser, session: { access_token: 'mock-token' } }, 
          error: null 
        };
      }
      // Server-side: implement your auth logic here
      return { data: { user: null, session: null }, error: null };
    },
    signOut: async () => {
      if (isBrowser) {
        localStorage.removeItem('mock_user');
        localStorage.removeItem('mock_session');
        return { error: null };
      }
      // Server-side: implement your auth logic here
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      if (isBrowser) {
        // Mock auth state change
        const userStr = localStorage.getItem('mock_user');
        const sessionStr = localStorage.getItem('mock_session');
        const session = sessionStr ? JSON.parse(sessionStr) : null;
        callback('SIGNED_IN', session);
        
        // Listen for storage changes
        const handleStorageChange = () => {
          const newUserStr = localStorage.getItem('mock_user');
          const newSessionStr = localStorage.getItem('mock_session');
          if (newUserStr && newSessionStr) {
            callback('SIGNED_IN', JSON.parse(newSessionStr));
          } else {
            callback('SIGNED_OUT', null);
          }
        };
        window.addEventListener('storage', handleStorageChange);
        
        return {
          data: { subscription: { id: 'mock-sub' } },
          unsubscribe: () => {
            window.removeEventListener('storage', handleStorageChange);
          },
        };
      }
      // Server-side: implement your auth state change listener here
      return {
        data: { subscription: null },
        unsubscribe: () => {},
      };
    },
  };
}

// Export singleton instance
export const postgres = new PostgresClient();

// For backward compatibility, export as 'supabase'
export const supabase = postgres;

export default postgres;

