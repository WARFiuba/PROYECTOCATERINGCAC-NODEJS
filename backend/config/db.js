import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({path: './.env/.env'});

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

pool.getConnection()
    .then(connection => {
        console.log('db conectada');
        connection.release();
    })
    .catch(error => {
        console.log('error', error);
    });  

export default pool;