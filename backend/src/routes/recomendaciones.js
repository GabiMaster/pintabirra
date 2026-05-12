const express = require('express')
const router = express.Router()
const verificarToken = require('../middleware/auth')
const {
  getRecomendaciones,
  getPreferencias,
  agregarPreferencia,
  eliminarPreferencia
} = require('../controllers/recomendacionesController')

router.get('/', verificarToken, getRecomendaciones)
router.get('/preferencias', verificarToken, getPreferencias)
router.post('/preferencias', verificarToken, agregarPreferencia)
router.delete('/preferencias/:preferencia_id', verificarToken, eliminarPreferencia)

module.exports = router
