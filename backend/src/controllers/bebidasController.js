const pool = require('../db/connection')

const getBebidas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bebidas ORDER BY nombre')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const getBebidaById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('SELECT * FROM bebidas WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bebida no encontrada' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const createBebida = async (req, res) => {
  const { nombre, tipo, descripcion, porcentaje_alcohol } = req.body // eslint-disable-line camelcase
  try {
    const result = await pool.query(
      'INSERT INTO bebidas (nombre, tipo, descripcion, porcentaje_alcohol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, tipo, descripcion, porcentaje_alcohol] // eslint-disable-line camelcase
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const updateBebida = async (req, res) => {
  const { id } = req.params
  const { nombre, tipo, descripcion, porcentaje_alcohol } = req.body // eslint-disable-line camelcase
  try {
    const result = await pool.query(
      'UPDATE bebidas SET nombre=$1, tipo=$2, descripcion=$3, porcentaje_alcohol=$4 WHERE id=$5 RETURNING *',
      [nombre, tipo, descripcion, porcentaje_alcohol, id] // eslint-disable-line camelcase
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const deleteBebida = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM bebidas WHERE id = $1', [id])
    res.json({ mensaje: 'Bebida eliminada' })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

module.exports = { getBebidas, getBebidaById, createBebida, updateBebida, deleteBebida }
