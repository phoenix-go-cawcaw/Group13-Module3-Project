import { db } from "../config/db.js";

export const getPlans = async (req, res) => {
  try {
    const [plans] = await db.query("SELECT * FROM subscription_plans");
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};