import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {

  if (req.method === "GET") {
    try {
      const result = await pool.query(
        "SELECT * FROM sheets ORDER BY created_at DESC"
      );

      return res.status(200).json(result.rows);

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {

      const { name, link, category, image } = req.body;

      const result = await pool.query(
        `INSERT INTO sheets (name, link, category, image)
         VALUES ($1,$2,$3,$4)
         RETURNING *`,
        [name, link, category, image]
      );

      return res.status(200).json(result.rows[0]);

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
