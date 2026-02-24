import pool from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const [existing] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    )

    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    )

    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ token })

  } catch (error) {
    res.status(500).json({ message: 'Registration failed.' })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    const user = users[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token })

  } catch (error) {
    res.status(500).json({ message: 'Login failed.' })
  }
}