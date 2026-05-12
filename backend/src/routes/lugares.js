const express = require('express')
const router = express.Router()
const verificarToken = require('../middleware/auth')
const {
  getLugares,
  getLugarById,
  createLugar,
  updateLugar,
  deleteLugar
} = require('../controllers/lugaresController')

router.get('/', getLugares)
router.get('/:id', getLugarById)
router.post('/', verificarToken, createLugar)
router.put('/:id', verificarToken, updateLugar)
router.delete('/:id', verificarToken, deleteLugar)

module.exports = router
