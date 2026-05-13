const pool = require('../db/connection')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const { nombre, email, password } = req.body

  try {
    const userExists = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    )

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt) // eslint-disable-line camelcase

    const newUser = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, password_hash] // eslint-disable-line camelcase
    )

    res.status(201).json({ usuario: newUser.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    )

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' })
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash)

    if (!validPassword) {
      return res.status(400).json({ error: 'Contraseña incorrecta' })
    }

    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, usuario: { id: user.rows[0].id, nombre: user.rows[0].nombre, email: user.rows[0].email } })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

module.exports = { register, login }
