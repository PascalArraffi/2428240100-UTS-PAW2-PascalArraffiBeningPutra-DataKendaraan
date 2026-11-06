import express from 'express'
import KendaraanController from '../controllers/kendaraan.controller.js'

const router = express.Router()

router.post('/', KendaraanController.store)
router.get('/', KendaraanController.index)
router.get('/:id', KendaraanController.show)
router.put('/:id', KendaraanController.update)
router.delete('/:id', KendaraanController.destroy)

export default router;