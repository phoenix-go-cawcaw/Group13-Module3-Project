import { db } from "../config/db.js";

export const addShippingOption = async (req, res) => {
  try {
    const {
      name,
      country,
      address,
      city,
      province,
      postalcode,
      phonenumber
    } = req.body;

    if (!name || !country || !address)
      return res.status(400).json({ message: "Missing required fields" });

    await db.query(
      `INSERT INTO shipping_options
       (name, country, address, city, province, postalcode, phonenumber)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, country, address, city, province, postalcode, phonenumber]
    );

    res.status(201).json({ message: "Shipping information saved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getShippingOptions = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM shipping_options");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
