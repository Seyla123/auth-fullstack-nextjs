import Database from 'better-sqlite3';

// Initialize the SQLite database
export const db = new Database('./db.sqlite', {
    verbose: console.log,
});

// Create the users table if it doesn't exist
export const initDb = () => {
    const createTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

    createTable.run();
};
initDb();