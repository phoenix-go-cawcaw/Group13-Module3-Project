import dotenv from 'dotenv'
dotenv.config()

import mysql from 'mysql2/promise'

const dbPassword = process.env.DB_PASSWORD ?? process.env.DB_PASS ?? ''

console.log('DB Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: dbPassword ? '***' : 'undefined',
  database: process.env.DB_NAME
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: dbPassword,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("Database connected successfully")
    connection.release()
  } catch (error) {
    console.error("Database connection failed:", error)
  }
}

testConnection()

export const db = pool
export default pool
