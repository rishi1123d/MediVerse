require('dotenv').config();
const { Client } = require('pg');

// Get database credentials from environment variables
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT || 5432;

// Create a new client instance
const client = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

// Connect to the database and query data
client.connect()
  .then(() => {
    console.log('Connected to the database.');
    return client.query('SELECT * FROM patients;');
  })
  .then((res: any) => {
    console.log('Query results:', res.rows);
  })
  .catch((err: any) => {
    console.error('Error connecting or querying the database:', err);
  })
  .finally(() => {
    client.end();
  });
