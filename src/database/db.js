/**
 * WUB BloodConnect - Database Connection & Engine Manager
 * Supports production PostgreSQL with intelligent local fallback
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const config = require('../config/env');

let pool = null;
let usePg = false;

// Path for local persistent storage fallback
const LOCAL_DATA_DIR = path.resolve(__dirname, '../../data');
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, 'db_store.json');

// Memory store for local mode
let localStore = {
  departments: [],
  locations: [],
  users: [],
  profiles: [],
  verification_requests: [],
  donor_profiles: [],
  blood_requests: [],
  request_matches: [],
  contact_requests: [],
  notifications: [],
  reports: [],
  audit_logs: [],
  system_settings: []
};

const mongo = require('./mongo');

function loadLocalStore() {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(LOCAL_DATA_FILE)) {
      const content = fs.readFileSync(LOCAL_DATA_FILE, 'utf8');
      localStore = Object.assign(localStore, JSON.parse(content));
    } else {
      saveLocalStore();
    }
  } catch (err) {
    console.error('[DB] Error loading local store:', err.message);
  }
}

function saveLocalStore(tableName = null) {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(localStore, null, 2), 'utf8');

    // Asynchronously sync to MongoDB Atlas if connected
    if (mongo.isMongoConnected()) {
      if (tableName) {
        syncTableToMongo(tableName);
      } else {
        Object.keys(localStore).forEach(t => syncTableToMongo(t));
      }
    }
  } catch (err) {
    console.error('[DB] Error saving local store:', err.message);
  }
}

async function syncTableToMongo(tableName) {
  if (!mongo.isMongoConnected()) return;
  try {
    const mongoDb = mongo.getDb();
    if (!mongoDb || !localStore[tableName]) return;
    const col = mongoDb.collection(tableName);
    const records = localStore[tableName];
    for (const record of records) {
      const filter = record.id ? { id: record.id } : (record._id ? { _id: record._id } : null);
      if (filter) {
        await col.updateOne(filter, { $set: record }, { upsert: true });
      }
    }
  } catch (err) {
    // Non-blocking sync log
    console.error(`[DB-Mongo] Sync error for ${tableName}:`, err.message);
  }
}

async function hydrateFromMongo() {
  if (!mongo.isMongoConnected()) return;
  try {
    const mongoDb = mongo.getDb();
    if (!mongoDb) return;
    const collections = Object.keys(localStore);
    for (const colName of collections) {
      const docs = await mongoDb.collection(colName).find({}).toArray();
      if (docs && docs.length > 0) {
        localStore[colName] = docs;
      }
    }
    // Update local JSON cache
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(localStore, null, 2), 'utf8');
    console.log('✔ [DB-Mongo] Data successfully synced from MongoDB Atlas.');
  } catch (err) {
    console.error('[DB-Mongo] Hydration error:', err.message);
  }
}

// Check PG & MongoDB connections
async function initDb() {
  loadLocalStore();

  // 1. Connect MongoDB Atlas if configured
  if (config.MONGODB_URI) {
    try {
      const mongoStatus = await mongo.connectMongo();
      if (mongoStatus.isConnected) {
        await hydrateFromMongo();
      }
    } catch (mErr) {
      console.error('[DB] MongoDB init error:', mErr.message);
    }
  }

  // 2. Check PG connection if configured
  const connectionString = config.DATABASE_URL || 
    `postgresql://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}`;

  try {
    pool = new Pool({
      connectionString: config.DATABASE_URL || undefined,
      host: config.PGHOST,
      user: config.PGUSER,
      password: config.PGPASSWORD,
      database: config.PGDATABASE,
      port: config.PGPORT,
      connectionTimeoutMillis: 2000
    });

    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();

    usePg = true;
    console.log('✔ [DB] Successfully connected to PostgreSQL database.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('✔ [DB] PostgreSQL schema verified/initialized.');
    }
  } catch (pgError) {
    usePg = false;
    if (!mongo.isMongoConnected()) {
      console.log(`ℹ [DB] PostgreSQL not detected locally. Operating in persistent engine mode.`);
    }
  }

  return { usePg, useMongo: mongo.isMongoConnected() };
}

// Local store query simulator for standard CRUD
function localQuery(text, params = []) {
  const cleanSql = text.trim();
  const lower = cleanSql.toLowerCase();

  // 1. SELECT queries
  if (lower.startsWith('select')) {
    const tableMatch = lower.match(/from\s+([a-zA-Z0-9_]+)/);
    if (!tableMatch) return { rows: [], rowCount: 0 };
    const tableName = tableMatch[1];
    let rows = localStore[tableName] ? [...localStore[tableName]] : [];

    // Simple WHERE filter parser for parameters
    if (lower.includes('where')) {
      const wherePart = cleanSql.substring(cleanSql.toLowerCase().indexOf('where') + 5);
      
      // Handle id = $1
      const paramMatches = [...wherePart.matchAll(/([a-zA-Z0-9_]+)\s*(=|!=|like|in)\s*\$([0-9]+)/gi)];
      for (const m of paramMatches) {
        const field = m[1];
        const op = m[2].toLowerCase();
        const paramIdx = parseInt(m[3], 10) - 1;
        const targetVal = params[paramIdx];

        rows = rows.filter(r => {
          if (targetVal === undefined) return true;
          const val = r[field];
          if (op === '=') return String(val).toLowerCase() === String(targetVal).toLowerCase();
          if (op === '!=') return String(val).toLowerCase() !== String(targetVal).toLowerCase();
          if (op === 'like') return String(val).toLowerCase().includes(String(targetVal).replace(/%/g, '').toLowerCase());
          return true;
        });
      }
    }

    // ORDER BY handling
    if (lower.includes('order by')) {
      const orderPart = lower.substring(lower.indexOf('order by') + 8);
      const isDesc = orderPart.includes('desc');
      const orderFieldMatch = orderPart.match(/([a-zA-Z0-9_]+)/);
      if (orderFieldMatch) {
        const field = orderFieldMatch[1];
        rows.sort((a, b) => {
          if (a[field] < b[field]) return isDesc ? 1 : -1;
          if (a[field] > b[field]) return isDesc ? -1 : 1;
          return 0;
        });
      }
    }

    // LIMIT handling
    const limitMatch = lower.match(/limit\s+([0-9]+)/);
    if (limitMatch) {
      const lim = parseInt(limitMatch[1], 10);
      rows = rows.slice(0, lim);
    }

    return { rows, rowCount: rows.length };
  }

  // 2. INSERT queries
  if (lower.startsWith('insert into')) {
    const tableMatch = lower.match(/insert\s+into\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)/);
    if (!tableMatch) return { rows: [], rowCount: 0 };
    const tableName = tableMatch[1];
    const columns = tableMatch[2].split(',').map(c => c.trim());

    if (!localStore[tableName]) localStore[tableName] = [];

    const newRecord = {};
    columns.forEach((col, idx) => {
      newRecord[col] = params[idx] !== undefined ? params[idx] : null;
    });

    if (!newRecord.created_at) newRecord.created_at = new Date().toISOString();
    if (!newRecord.updated_at) newRecord.updated_at = new Date().toISOString();

    localStore[tableName].push(newRecord);
    saveLocalStore();
    return { rows: [newRecord], rowCount: 1 };
  }

  // 3. UPDATE queries
  if (lower.startsWith('update')) {
    const tableMatch = lower.match(/update\s+([a-zA-Z0-9_]+)\s+set/);
    if (!tableMatch) return { rows: [], rowCount: 0 };
    const tableName = tableMatch[1];
    if (!localStore[tableName]) return { rows: [], rowCount: 0 };

    const setPartMatch = cleanSql.match(/set\s+(.+?)\s+where/i);
    const wherePartMatch = cleanSql.match(/where\s+(.+)$/i);

    let updatedRows = [];
    if (wherePartMatch) {
      const wherePart = wherePartMatch[1];
      const paramMatches = [...wherePart.matchAll(/([a-zA-Z0-9_]+)\s*=\s*\$([0-9]+)/gi)];

      localStore[tableName] = localStore[tableName].map(record => {
        let matches = true;
        for (const m of paramMatches) {
          const field = m[1];
          const paramIdx = parseInt(m[2], 10) - 1;
          if (String(record[field]) !== String(params[paramIdx])) {
            matches = false;
            break;
          }
        }

        if (matches) {
          if (setPartMatch) {
            const setAssignments = setPartMatch[1].split(',');
            setAssignments.forEach(assign => {
              const pair = assign.split('=');
              const col = pair[0].trim();
              const pIdxMatch = pair[1].match(/\$([0-9]+)/);
              if (pIdxMatch) {
                const pIdx = parseInt(pIdxMatch[1], 10) - 1;
                record[col] = params[pIdx];
              }
            });
          }
          record.updated_at = new Date().toISOString();
          updatedRows.push(record);
        }
        return record;
      });

      saveLocalStore();
    }

    return { rows: updatedRows, rowCount: updatedRows.length };
  }

  // 4. DELETE queries
  if (lower.startsWith('delete from')) {
    const tableMatch = lower.match(/delete\s+from\s+([a-zA-Z0-9_]+)/);
    if (!tableMatch) return { rows: [], rowCount: 0 };
    const tableName = tableMatch[1];
    if (!localStore[tableName]) return { rows: [], rowCount: 0 };

    const wherePartMatch = cleanSql.match(/where\s+(.+)$/i);
    let deletedCount = 0;

    if (wherePartMatch) {
      const wherePart = wherePartMatch[1];
      const paramMatches = [...wherePart.matchAll(/([a-zA-Z0-9_]+)\s*=\s*\$([0-9]+)/gi)];

      const initialLen = localStore[tableName].length;
      localStore[tableName] = localStore[tableName].filter(record => {
        for (const m of paramMatches) {
          const field = m[1];
          const paramIdx = parseInt(m[2], 10) - 1;
          if (String(record[field]) === String(params[paramIdx])) {
            return false;
          }
        }
        return true;
      });
      deletedCount = initialLen - localStore[tableName].length;
      saveLocalStore();
    }

    return { rows: [], rowCount: deletedCount };
  }

  return { rows: [], rowCount: 0 };
}

// Unified query entry point
async function query(text, params = []) {
  if (usePg && pool) {
    return pool.query(text, params);
  }
  return localQuery(text, params);
}

module.exports = {
  initDb,
  query,
  getStore: () => localStore,
  saveStore: saveLocalStore,
  getMongoDb: mongo.getDb,
  getMongoClient: mongo.getClient,
  isMongoConnected: mongo.isMongoConnected
};
