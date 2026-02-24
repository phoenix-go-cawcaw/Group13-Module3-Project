import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const normalizedEmail = (email || "").trim().toLowerCase();

  if (!username || !normalizedEmail || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // Checks if user exists
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [normalizedEmail],
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hashes password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserts user
    await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, normalizedEmail, hashedPassword],
    );

    // Generates JWT
    const token = jwt.sign({ email: normalizedEmail }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = (email || "").trim().toLowerCase();

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      normalizedEmail,
    ]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
