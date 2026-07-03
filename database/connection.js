import {open, moveAssetsDatabase} from '@op-engineering/op-sqlite';
import {wrapDatabase} from './webSqlAdapter';

const DB_NAME = 'database.db';

let _db = null;

// Open database, seeding it from the bundled asset on first launch.
export async function openDB() {
  // Copy the pre-filled seed database shipped in the android assets folder
  // into op-sqlite's default location. Replaces sqlite-storage's
  // `createFromLocation: 1`. Does NOT overwrite an existing user database,
  // so real data survives app restarts.
  try {
    await moveAssetsDatabase({filename: DB_NAME, overwrite: false});
  } catch (err) {
    console.log('Error seeding database from assets', err);
  }

  const opdb = open({name: DB_NAME});
  const base = wrapDatabase(opdb);

  // Enable foreign keys
  await base.executeSql('PRAGMA foreign_keys = ON');

  _db = base;
  return base;
}

// Get the current database instance
export function getDB() {
  if (!_db) {
    throw new Error('Database not initialized. Call openDB() first.');
  }
  return _db;
}

// Set the database instance (used after import/restore)
export function setDB(newDb) {
  _db = newDb;
}
