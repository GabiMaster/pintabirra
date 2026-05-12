const pool = require('../db/connection')

const getPerfil = async (req, res) => {
  const { id } = req.usuario
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, foto_url, created_at FROM usuarios WHERE id = $1',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const updatePerfil = async (req, res) => {
  const { id } = req.usuario
  const { nombre, fotoUrl } = req.body
  try {
    const result = await pool.query(
      'UPDATE usuarios SET nombre=$1, foto_url=$2 WHERE id=$3 RETURNING id, nombre, email, foto_url',
      [nombre, fotoUrl, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const buscarUsuarios = async (req, res) => {
  const { q } = req.query
  try {
    const result = await pool.query(
      'SELECT id, nombre, email FROM usuarios WHERE nombre ILIKE $1',
      [`%${q}%`]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const agregarAmigo = async (req, res) => {
  const { id } = req.usuario
  const { amigoId } = req.body
  try {
    const existe = await pool.query(
      'SELECT * FROM amistades WHERE usuario_id=$1 AND amigo_id=$2',
      [id, amigoId]
    )
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe esa amistad' })
    }
    const result = await pool.query(
      'INSERT INTO amistades (usuario_id, amigo_id, estado) VALUES ($1, $2, $3) RETURNING *',
      [id, amigoId, 'pendiente']
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const getAmigos = async (req, res) => {
  const { id } = req.usuario
  try {
    const result = await pool.query(
      `SELECT u.id, u.nombre, u.email, a.estado 
       FROM amistades a 
       JOIN usuarios u ON u.id = a.amigo_id 
       WHERE a.usuario_id = $1`,
      [id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

module.exports = { getPerfil, updatePerfil, buscarUsuarios, agregarAmigo, getAmigos }
