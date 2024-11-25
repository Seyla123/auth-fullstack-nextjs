import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
// Initialize the SQLite database
const dbPath = path.join('/tmp', 'db.sqlite');
export const db = new Database(dbPath, {
  verbose: console.log,
});

// Create the users table if it doesn't exist
export const initDb = async () => {
  const createUsersTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'user',
      password TEXT NOT NULL,
      oldPassword TEXT NULL,
      passwordChangedAt DATETIME,
      active TEXT NOT NULL DEFAULT 'true',
      emailVerificationToken TEXT,
      emailVerifiedExpiresAt DATETIME,
      emailVerified TEXT NOT NULL DEFAULT 'false', 
      passwordResetToken TEXT ,
      passwordResetExpiresAt DATETIME,
      passwordResetRequestDate DATETIME NULL,
      passwordResetRequest INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME
    )
  `);
  const dropTableInvite = db.prepare('DROP TABLE IF EXISTS invites');
  const dropTableUsers = db.prepare('DROP TABLE IF EXISTS users');
  const createInvitesTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS invites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE, 
      role TEXT NOT NULL CHECK(role IN ('user', 'admin')), 
      inviteToken TEXT NOT NULL,  
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'expired')),  
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiredAt DATETIME,
      invitedBy INTEGER,  
      FOREIGN KEY (invitedBy) REFERENCES users(id) 
    )
  `);

  try {
    
    createUsersTable.run(); // Only call once
    createInvitesTable.run();
  } catch (error) {
    console.error('Error creating users table:', error);
  }

  // Add one admin if that admin does not exist yet
  const admin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@mail.com');
  if (!admin) {
    const hashedPassword = bcrypt.hashSync('admin758@', 12);
    db.prepare('INSERT INTO users (username, email, role, password, emailVerified) VALUES (?, ?, ?, ?, ?)').run('Admin', 'admin@mail.com', 'admin', hashedPassword, 'true');
  }
  console.log('Database initialized');
};

initDb();
