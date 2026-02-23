import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import generateToken from "../utils/token.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const [existing] = await db.query(
      "SELECT user_id FROM users WHERE email = ? OR username = ?", [email, username]);

    if (existing.length)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);

    const token = generateToken(result.insertId);

    res.status(201).json({
      token,
      user: {
        user_id: result.insertId,
        username,
        email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length)
      return res.status(400).json({ message: "User not found" });

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(400).json({ message: "Invalid password" });

    res.json({
      token: generateToken(user.user_id),
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
