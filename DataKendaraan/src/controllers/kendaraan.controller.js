import mongoose from 'mongoose'
import Kendaraan from '../models/kendaraan.js'

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

const pickFields = (body) => ({
	nomor_kendaraan: body.nomor_kendaraan,
	brand: body.brand,
	tipe_kendaraan: body.tipe_kendaraan,
	tahun_produksi: body.tahun_produksi,
})

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const sortableFields = new Set([
	'nomor_kendaraan',
	'brand',
	'tipe_kendaraan',
	'tahun_produksi',
])

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
			const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''
			const { sortBy, order } = req.query
			const filter = {}

			if (search) {
				const searchPattern = escapeRegex(search)
				filter.$or = [
					{ nomor_kendaraan: { $regex: searchPattern, $options: 'i' } },
					{ brand: { $regex: searchPattern, $options: 'i' } },
					{ tipe_kendaraan: { $regex: searchPattern, $options: 'i' } },
				]

				if (/^\d+$/.test(search)) {
					filter.$or.push({ tahun_produksi: Number(search) })
				}
			}

			if (sortBy !== undefined && (typeof sortBy !== 'string' || !sortableFields.has(sortBy))) {
				return res.status(400).json({
					success: false,
					message: `Field pengurutan tidak valid. Pilih: ${[...sortableFields].join(', ')}`,
				})
			}

			if (order !== undefined && (typeof order !== 'string' || !['asc', 'desc'].includes(order.toLowerCase()))) {
				return res.status(400).json({
					success: false,
					message: 'Arah pengurutan harus asc atau desc',
				})
			}

			if (order !== undefined && sortBy === undefined) {
				return res.status(400).json({
					success: false,
					message: 'sortBy wajib diisi jika order digunakan',
				})
			}

			const query = Kendaraan.find(filter)
			if (sortBy) {
				query.sort({ [sortBy]: order?.toLowerCase() === 'desc' ? -1 : 1 })
			}

			const data = await query
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
