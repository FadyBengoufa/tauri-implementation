const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors({
  origin: 'http://localhost:9000',
  // credentials: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:9000');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});
app.use(express.json());

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'test_database.db'); // Use a relative path for local database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database", err.message);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

// Create a table if it doesn’t already exist
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      surname TEXT NOT NULL
    )
  `);
}

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

app.get('/', (req, res) => {
  res.send('Hello from Tauri sidecar with SQLite!');
});

let nexPersonId = 3;
const people = [
  {id: 1, name: 'John', surname: 'Doe'},
  {id: 2, name: 'Anna', surname: 'Dopey'},
];

app.get('/people', (req, res) => {
  res.send(people);
  // db.all("SELECT * FROM people", [], (err, rows) => {
  //   if (err) {
  //     res.status(500).json({ error: err.message });
  //   } else {
  //     res.json(rows);
  //   }
  // });
});

app.get('/people/:id', (req, res) => {
  const personId = +req.params.id;

  const person = people.find(person => person.id === personId);

  if(!person) {
    res.sendStatus(404);
    return;
  }

  res.send(person);
});

app.post('/people', (req, res) => {
  if(!req.body){
    res.status(400).json({ error: 'Body not specified' });
    return;
  }

  if(!req.body.name){
    res.status(400).json({ error: 'No name specified' });
    return;
  }

  if(!req.body.surname){
    res.status(400).json({ error: 'No surname specified' });
    return;
  }

  const newPerson = {
    ...req.body,
    id: nexPersonId++
  };

  people.push(newPerson);

  res.send(newPerson);
});

// import { Command } from '@tauri-apps/api/shell';

// async function startSidecar() {
//   try {
//     const command = Command.sidecar('binaries/my-sidecar');
//     await command.spawn(); // This starts the sidecar backend
//     console.log('Sidecar started');
//   } catch (error) {
//     console.error('Error starting sidecar:', error);
//   }
// }

// startSidecar();
