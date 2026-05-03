const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

//  CONNECTION STRING 
const connectionString = 'postgresql://postgres:AirOps2026db@db.vgwcvvsecmtttjoducxd.supabase.co:5432/postgres';

console.log("Connection string:", connectionString);

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

//  Test conexión
app.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ ok: true, time: result.rows[0] });
  } catch (error) {
    console.error('❌ ERROR CONEXIÓN:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

//  Vuelos
app.get('/vuelos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.codigo, v.ruta, v.estado, p.nombre AS piloto
      FROM vuelos v
      LEFT JOIN pilotos p ON v.piloto_id = p.id
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('❌ ERROR EN VUELOS:', error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.get('/pilotos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre FROM pilotos');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ ERROR EN PILOTOS:', error);
    res.status(500).json({ error: error.message });
  }
});

//  Aviones
app.get('/aviones', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, matricula, marca, modelo, capacidad, estado
      FROM aviones
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('❌ ERROR EN AVIONES:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log(' Servidor en http://localhost:3000');
});

app.use(express.json());

//  LOGIN SIMPLE
app.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  //  USUARIO HARDCODE
  if (usuario === 'admin' && password === '1234') {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
  }
});