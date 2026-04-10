require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '5657',
  port: 5432,
});

async function hashIfNeeded(table) {
  const res = await pool.query(`SELECT id, password FROM ${table}`);
  let updated = 0;
  for (const row of res.rows) {
    const pwd = row.password || '';
    if (!pwd.startsWith('$2')) {
      const hash = await bcrypt.hash(pwd || 'changeme', 10);
      await pool.query(`UPDATE ${table} SET password = $1 WHERE id = $2`, [hash, row.id]);
      updated++;
      console.log(`Updated ${table} id=${row.id}`);
    }
  }
  return updated;
}

async function run() {
  try {
    const u1 = await hashIfNeeded('admin');
    const u2 = await hashIfNeeded('users');
    console.log(`Done. admin updated: ${u1}, users updated: ${u2}`);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
