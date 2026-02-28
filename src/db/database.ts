import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_NAME = 'storageapp';

const DB_VERSION = 1;

const SQL_CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS products (
  id              TEXT PRIMARY KEY,
  sections        TEXT NOT NULL,
  inventory       INTEGER NOT NULL,
  type            TEXT NOT NULL,
  capacity        TEXT,
  itemNo          TEXT,
  batchNumber     TEXT,
  color           TEXT,
  finishType      TEXT,
  qtyPerLayer     INTEGER,
  numberOfLayers  INTEGER,
  piecesPerPallet INTEGER,
  numberOfPallet  INTEGER,
  dateOfProduction TEXT,
  createdAt        TEXT NOT NULL
);
`;

let _db: SQLiteDBConnection | null = null;
let _sqlite: SQLiteConnection | null = null;

/**
 * Returns the singleton DB connection, initializing it on first call.
 * On web (browser dev), uses jeep-sqlite shim.
 * On Android/iOS, uses native SQLite.
 */
export async function getDB(): Promise<SQLiteDBConnection> {
    if (_db) return _db;

    const platform = Capacitor.getPlatform();

    _sqlite = new SQLiteConnection(CapacitorSQLite);

    if (platform === 'web') {
        const jeepEl = document.querySelector('jeep-sqlite');
        if (!jeepEl) {
            throw new Error('jeep-sqlite element not found in DOM.');
        }
        await _sqlite.initWebStore();
    }

    try {
        // First check if connection exists in the plugin
        const isConn = (await _sqlite.isConnection(DB_NAME, false)).result;

        if (isConn) {
            _db = await _sqlite.retrieveConnection(DB_NAME, false);
        } else {
            _db = await _sqlite.createConnection(
                DB_NAME,
                false,
                'no-encryption',
                DB_VERSION,
                false
            );
        }
    } catch (err: any) {
        // Fallback for HMR where the connection thinks it exists but retrieve fails
        if (err.message && err.message.includes('already exists')) {
            _db = await _sqlite.retrieveConnection(DB_NAME, false);
        } else {
            throw err;
        }
    }

    if (_db) {
        await _db.open();
        await _db.execute(SQL_CREATE_TABLES);

        // Simple Migration: Add inventory column if missing
        try {
            await _db.execute(`ALTER TABLE products ADD COLUMN inventory INTEGER DEFAULT 1;`);
            console.log('Migration: Added inventory column');
        } catch (e) {
            // Column already exists
        }
    } else {
        throw new Error('Failed to create or retrieve SQLite connection.');
    }

    return _db;
}

/** 
 * On web, we must explicitly save the db to IndexedDB after mutations.
 * On native, this is a no-op / not needed.
 */
export async function saveWebStore(): Promise<void> {
    const platform = Capacitor.getPlatform();
    if (platform === 'web' && _sqlite) {
        try {
            await _sqlite.saveToStore(DB_NAME);
        } catch (e) {
            console.warn('Failed to save to web store:', e);
        }
    }
}

/** Close the DB connection (call on app teardown if needed). */
export async function closeDB(): Promise<void> {
    if (_db && _sqlite) {
        await saveWebStore();
        await _sqlite.closeConnection(DB_NAME, false);
        _db = null;
    }
}
