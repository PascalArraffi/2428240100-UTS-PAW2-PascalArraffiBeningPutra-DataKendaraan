import express from 'express'

import upload from '../config/upload.js'
import KendaraanController from '../controllers/kendaraan.controller.js'
import UploadController from '../controllers/upload.controller.js'
import UserController from '../controllers/user.controller.js'
import WelcomeController from '../controllers/welcome.controller.js'

const router = express.Router()

router.get('/welcome', WelcomeController.welcome)
router.post('/users', UserController.store)
router.post('/upload', upload.single('file'), UploadController.store)
router.post('/data-kendaraan', KendaraanController.store)
router.get('/data-kendaraan', KendaraanController.index)
router.get('/data-kendaraan/:id', KendaraanController.show)
router.put('/data-kendaraan/:id', KendaraanController.update)
router.delete('/data-kendaraan/:id', KendaraanController.destroy)

export default router
