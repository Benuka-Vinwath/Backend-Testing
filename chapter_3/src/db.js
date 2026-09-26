import {DatabaseSync} from 'node:sqlite'
const db = new DatabaseSync(':memory:') //create a new database in memory

//executes a sql statemnt from strings 
db.exec(`
    CREATE TABLE users(
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT
    )
`)

db.exec(`
    CREATE TABLE todos(
        id INTEGER,
        user_id INTEGER,
        task TEXT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)

    )
  `)

  export default db 