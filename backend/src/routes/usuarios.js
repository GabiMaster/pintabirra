const express = require('express')
const router = express.Router()
const verificarToken = require('../middleware/auth')
const {
  getPerfil,
  updatePerfil,
  buscarUsuarios,
  agregarAmigo,
  getAmigos
} = require('../controllers/usuariosController')

router.get('/perfil', verificarToken, getPerfil)
router.put('/perfil', verificarToken, updatePerfil)
router.get('/buscar', verificarToken, buscarUsuarios)
router.post('/amigos', verificarToken, agregarAmigo)
router.get('/amigos', verificarToken, getAmigos)

module.exports = router
