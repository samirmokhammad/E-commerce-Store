const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.host,
    port: process.env.port,
    database: process.env.database,
    user: process.env.user,
    connectionString: process.env.DB_CONNECTION_STRING,
    ssl:
        process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('DB connection error', err);
    } else {
        console.log('DB connected:', res.rows);
    }
});

module.exports = pool;
