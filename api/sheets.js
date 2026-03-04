import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {

  if (req.method === "GET") {

    const result = await pool.query(
      "SELECT * FROM sheets ORDER BY created_at DESC"
    );

    res.status(200).json(result.rows);
  }

  if (req.method === "POST") {

    const { name, link, category, image } = req.body;

    const result = await pool.query(
      `INSERT INTO sheets (name, link, category, image)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [name, link, category, image]
    );

    res.status(200).json(result.rows[0]);
  }
}
