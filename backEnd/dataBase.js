const sqlite3 = require('sqlite3');
const dataBase = new sqlite3.Database('users.db');

dataBase.serialize(() => {
  dataBase.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      birth_date TEXT,
      gender TEXT
    )
  `);
});

module.exports = dataBase;