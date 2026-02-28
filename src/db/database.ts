import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_NAME = 'storageapp';

const DB_VERSION = 1;

const SQL_CREATE_TABLES = `
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS products (
  id              TEXT PRIMARY KEY,
  sections        TEXT NOT NULL DEFAULT '[]',
  type            TEXT NOT NULL DEFAULT '',
  capacity        TEXT NOT NULL DEFAULT '',
  itemNo          TEXT NOT NULL DEFAULT '',
  batchNumber     TEXT NOT NULL DEFAULT '',
  color           TEXT NOT NULL DEFAULT '',
  finishType      TEXT NOT NULL DEFAULT '',
  qtyPerLayer     INTEGER NOT NULL DEFAULT 0,
  numberOfLayers  INTEGER NOT NULL DEFAULT 0,
  piecesPerPallet INTEGER NOT NULL DEFAULT 0,
  numberOfPallet  INTEGER NOT NULL DEFAULT 0,
  dateOfProduction TEXT NOT NULL DEFAULT '',
  createdAt        TEXT NOT NULL DEFAULT ''
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

    if (platform === 'web') {
        // Bring in jeep-sqlite web component for browser-based dev/test
        const { defineCustomElements } = await import('jeep-sqlite/loader');
        defineCustomElements(window);

        // Wait for the custom element to be defined before using it
        await customElements.whenDefined('jeep-sqlite');

        const jeepEl = document.querySelector('jeep-sqlite');
        if (!jeepEl) {
            throw new Error('jeep-sqlite element not found. Make sure it is in index.html.');
        }
        await (jeepEl as any).initWebStore();
    }

    _sqlite = new SQLiteConnection(CapacitorSQLite);

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

    await _db.open();
    await _db.execute(SQL_CREATE_TABLES);

    return _db;
}

/** Close the DB connection (call on app teardown if needed). */
export async function closeDB(): Promise<void> {
    if (_db && _sqlite) {
        await _sqlite.closeConnection(DB_NAME, false);
        _db = null;
    }
}
