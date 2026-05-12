const express = require('express')
const router = express.Router()
const verificarToken = require('../middleware/auth')
const {
  getBebidas,
  getBebidaById,
  createBebida,
  updateBebida,
  deleteBebida
} = require('../controllers/bebidasController')

router.get('/', getBebidas)
router.get('/:id', getBebidaById)
router.post('/', verificarToken, createBebida)
router.put('/:id', verificarToken, updateBebida)
router.delete('/:id', verificarToken, deleteBebida)

module.exports = router
