import mongoose from 'mongoose'
import Kendaraan from '../models/kendaraan.js'

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

const pickFields = (body) => ({
	nomor_kendaraan: body.nomor_kendaraan,
	brand: body.brand,
	tipe_kendaraan: body.tipe_kendaraan,
	tahun_produksi: body.tahun_produksi,
})

class KendaraanController {
	static async store(req, res) {
		try {
			const kendaraan = await Kendaraan.create(pickFields(req.body))
			return res.status(201).json({
				success: true,
				message: 'Data kendaraan berhasil ditambahkan',
				data: kendaraan,
			})
		} catch (error) {
			const status = error.name === 'ValidationError' ? 400 : 500
			return res.status(status).json({ success: false, message: error.message })
		}
	}

	static async index(req, res) {
		try {
			const data = await Kendaraan.find()
			return res.status(200).json({ success: true, count: data.length, data })
		} catch (error) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async show(req, res) {
		const { id } = req.params
		if (!isValidId(id)) {
			return res.status(400).json({ success: false, message: 'ID tidak valid' })
		}

		try {
			const kendaraan = await Kendaraan.findById(id)
			if (!kendaraan) {
				return res.status(404).json({ success: false, message: 'Data tidak ditemukan' })
			}
			return res.status(200).json({ success: true, data: kendaraan })
		} catch (error) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async update(req, res) {
		const { id } = req.params
		if (!isValidId(id)) {
			return res.status(400).json({ success: false, message: 'ID tidak valid' })
		}

		try {
			const kendaraan = await Kendaraan.findByIdAndUpdate(id, pickFields(req.body), {
				new: true,
				runValidators: true,
			})
			if (!kendaraan) {
				return res.status(404).json({ success: false, message: 'Data kendaraan tidak ditemukan' })
			}
			return res.status(200).json({
				success: true,
				message: 'Data kendaraan berhasil diperbarui',
				data: kendaraan,
			})
		} catch (error) {
			const status = error.name === 'ValidationError' ? 400 : 500
			return res.status(status).json({ success: false, message: error.message })
		}
	}

	static async destroy(req, res) {
		const { id } = req.params
		if (!isValidId(id)) {
			return res.status(400).json({ success: false, message: 'ID tidak valid' })
		}

		try {
			const kendaraan = await Kendaraan.findByIdAndDelete(id)
			if (!kendaraan) {
				return res.status(404).json({ success: false, message: 'Data kendaraan tidak ditemukan' })
			}
			return res.status(200).json({ success: true, message: 'Data kendaraan berhasil dihapus' })
		} catch (error) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}
}

export default KendaraanController
