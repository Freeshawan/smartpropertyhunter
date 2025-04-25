import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM properties ORDER BY created_at DESC LIMIT 10'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur PostgreSQL:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
