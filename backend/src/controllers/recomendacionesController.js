const pool = require('../db/connection')

const getRecomendaciones = async (req, res) => {
  const { id } = req.usuario
  try {
    const preferencias = await pool.query(
      'SELECT tipo_bebida FROM preferencias WHERE usuario_id = $1',
      [id]
    )

    if (preferencias.rows.length === 0) {
      return res.json({
        bebidas: [],
        lugares: [],
        mensaje: 'Agregá preferencias en tu perfil para recibir recomendaciones'
      })
    }

    const tipos = preferencias.rows.map(p => p.tipo_bebida)

    const bebidas = await pool.query(
      'SELECT * FROM bebidas WHERE tipo = ANY($1) ORDER BY rating DESC LIMIT 5',
      [tipos]
    )

    const lugares = await pool.query(
      `SELECT DISTINCT l.* FROM lugares l
       JOIN bebidas_por_lugar bpl ON l.id = bpl.lugar_id
       JOIN bebidas b ON b.id = bpl.bebida_id
       WHERE b.tipo = ANY($1)
       ORDER BY l.rating DESC LIMIT 5`,
      [tipos]
    )

    res.json({
      bebidas: bebidas.rows,
      lugares: lugares.rows
    })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const getPreferencias = async (req, res) => {
  const { id } = req.usuario
  try {
    const result = await pool.query(
      'SELECT * FROM preferencias WHERE usuario_id = $1',
      [id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const agregarPreferencia = async (req, res) => {
  const { id } = req.usuario
  const { tipo_bebida } = req.body // eslint-disable-line camelcase
  try {
    const existe = await pool.query(
      'SELECT * FROM preferencias WHERE usuario_id = $1 AND tipo_bebida = $2',
      [id, tipo_bebida] // eslint-disable-line camelcase
    )
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Ya tenés esa preferencia' })
    }
    const result = await pool.query(
      'INSERT INTO preferencias (usuario_id, tipo_bebida) VALUES ($1, $2) RETURNING *',
      [id, tipo_bebida] // eslint-disable-line camelcase
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const eliminarPreferencia = async (req, res) => {
  const { id } = req.usuario
  const { preferencia_id } = req.params // eslint-disable-line camelcase
  try {
    await pool.query(
      'DELETE FROM preferencias WHERE id = $1 AND usuario_id = $2',
      [preferencia_id, id] // eslint-disable-line camelcase
    )
    res.json({ mensaje: 'Preferencia eliminada' })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

module.exports = { getRecomendaciones, getPreferencias, agregarPreferencia, eliminarPreferencia }
