import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const rows = await sql`SELECT * FROM sheets ORDER BY created_at DESC`;
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const { name, link, category, image } = req.body;

      const rows = await sql`
        INSERT INTO sheets (name, link, category, image)
        VALUES (${name}, ${link}, ${category}, ${image})
        RETURNING *
      `;

      return res.status(200).json(rows[0]);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
