const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'test_database.sqlite'); // Adjust this path if necessary
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database for data population.");
    populateData();
  }
});

async function populateData() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `, async (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
        return;
      }
      console.log("Table 'people' created or already exists.");

      const sampleData = [
        { name: "John", surname: "Doe", password: "password123" },
        { name: "Anna", surname: "Smith", password: "password456" },
        { name: "Peter", surname: "Johnson", password: "password789" },
        { name: "Linda", surname: "Brown", password: "password101" },
        { name: "Emily", surname: "Davis", password: "password202" }
      ];

      const stmt = db.prepare("INSERT INTO people (name, surname, password) VALUES (?, ?, ?)");

      for (const { name, surname, password } of sampleData) {
        const hashedPassword = await bcrypt.hash(password, 10);
        stmt.run(name, surname, hashedPassword, (err) => {
          if (err) {
            console.error("Error inserting data:", err.message);
          }
        });
      }

      stmt.finalize((err) => {
        if (err) {
          console.error("Error finalizing statement:", err.message);
        } else {
          console.log("Sample data with encrypted passwords successfully inserted.");
        }
        db.close();
      });
    });
  });
}
