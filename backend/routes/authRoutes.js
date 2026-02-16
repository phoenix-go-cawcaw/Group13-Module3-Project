import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import pool from "../config/db.js"

const router = express.Router()

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields required" })
  }

  try {
    // Check if user exists
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user
    await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    )

    // Generate JWT
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.status(201).json({ token })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" })
  }

  try {
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const user = users[0]

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.json({ token })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router