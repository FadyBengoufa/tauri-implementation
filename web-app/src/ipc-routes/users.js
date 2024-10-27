// ipc-routes/users.js
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const { app } = require('electron');

let db;

// Initialize SQLite database
async function initDb() {
  if (!db) {
    db = await open({
      filename: path.join(app.getPath('userData'), 'users.sqlite'),
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        role TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  return db;
}

// User routes for IPC communication
const userRoutes = {
  'users:create': async (userData) => {
    const db = await initDb();
    const { name, email, role } = userData;
    const result = await db.run(
      'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
      [name, email, role]
    );
    return { id: result.lastID, name, email, role };
  },

  'users:getAll': async () => {
    const db = await initDb();
    return await db.all('SELECT * FROM users');
  },

  'users:getById': async (id) => {
    const db = await initDb();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) throw new Error('User not found');
    return user;
  },

  'users:update': async (id, userData) => {
    const db = await initDb();
    const { name, email, role } = userData;
    await db.run(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role, id]
    );
    return { id, name, email, role };
  },

  'users:delete': async (id) => {
    const db = await initDb();
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    return { success: true };
  }
};

module.exports = userRoutes;