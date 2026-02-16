import mysql from 'mysql/promise'

export const pool = mysql.createPool({
    user: 'root',
    host: 'localhost',
    database: 'hobbyinabox',
    password: 'Tw1st3dgemini!'
});