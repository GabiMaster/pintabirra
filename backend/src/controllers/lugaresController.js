const pool = require('../db/connection')

const getLugares = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lugares ORDER BY nombre')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const getLugarById = async (req, res) => {
  const { id } = req.params
  try {
    const lugar = await pool.query('SELECT * FROM lugares WHERE id = $1', [id])
    if (lugar.rows.length === 0) {
      return res.status(404).json({ error: 'Lugar no encontrado' })
    }
    const bebidas = await pool.query(
      'SELECT b.* FROM bebidas b JOIN bebidas_por_lugar bpl ON b.id = bpl.bebida_id WHERE bpl.lugar_id = $1',
      [id]
    )
    res.json({ ...lugar.rows[0], bebidas: bebidas.rows })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const createLugar = async (req, res) => {
  const { nombre, direccion, descripcion, tipo } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO lugares (nombre, direccion, descripcion, tipo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, direccion, descripcion, tipo]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const updateLugar = async (req, res) => {
  const { id } = req.params
  const { nombre, direccion, descripcion, tipo } = req.body
  try {
    const result = await pool.query(
      'UPDATE lugares SET nombre=$1, direccion=$2, descripcion=$3, tipo=$4 WHERE id=$5 RETURNING *',
      [nombre, direccion, descripcion, tipo, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const deleteLugar = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM lugares WHERE id = $1', [id])
    res.json({ mensaje: 'Lugar eliminado' })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

module.exports = { getLugares, getLugarById, createLugar, updateLugar, deleteLugar }
