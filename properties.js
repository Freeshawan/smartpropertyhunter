import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const {
    transaction, property_type, country, city, neighborhood,
    min_bedrooms, max_bedrooms, has_garage, has_garden, has_terrace,
    min_price, max_price
  } = req.query;

  const clauses = [], values = [];
  if (transaction)       clauses.push(`transaction = $${values.push(transaction)}`);
  if (property_type)     clauses.push(`property_type = $${values.push(property_type)}`);
  if (country)           clauses.push(`country ILIKE $${values.push(`%${country}%`)}`);
  if (city)              clauses.push(`city ILIKE $${values.push(`%${city}%`)}`);
  if (neighborhood)      clauses.push(`neighborhood ILIKE $${values.push(`%${neighborhood}%`)}`);
  if (min_bedrooms)      clauses.push(`bedrooms >= $${values.push(parseInt(min_bedrooms))}`);
  if (max_bedrooms)      clauses.push(`bedrooms <= $${values.push(parseInt(max_bedrooms))}`);
  if (has_garage === 'true')  clauses.push(`has_garage = true`);
  if (has_garden === 'true')  clauses.push(`has_garden = true`);
  if (has_terrace === 'true') clauses.push(`has_terrace = true`);
  if (min_price)         clauses.push(`price >= $${values.push(parseInt(min_price))}`);
  if (max_price)         clauses.push(`price <= $${values.push(parseInt(max_price))}`);
  const where = clauses.length ? 'WHERE ' + clauses.join(' AND ') : '';
  const sql = `SELECT * FROM properties ${where} ORDER BY price`;
  try {
    const { rows } = await pool.query(sql, values);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
