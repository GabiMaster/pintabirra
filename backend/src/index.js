const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./db/connection')
const authRoutes = require('./routes/auth')
const lugaresRoutes = require('./routes/lugares')
const bebidasRoutes = require('./routes/bebidas')
const usuariosRoutes = require('./routes/usuarios')
const recomendacionesRoutes = require('./routes/recomendaciones')

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err)
  } else {
    console.log('Base de datos conectada:', res.rows[0].now)
  }
})

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/lugares', lugaresRoutes)
app.use('/bebidas', bebidasRoutes)
app.use('/usuarios', usuariosRoutes)
app.use('/recomendaciones', recomendacionesRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a la API de PintaBirra' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
