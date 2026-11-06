import mongoose from 'mongoose';

const kendaraanSchema = new mongoose.Schema(
  {
    nomor_kendaraan: {
      type: String,
      required: [true, 'nomor_kendaraan wajib diisi'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'brand wajib diisi'],
      trim: true,
    },
    tipe_kendaraan: {
      type: String,
      required: [true, 'tipe_kendaraan wajib diisi'],
      trim: true,
    },
    tahun_produksi: {
      type: Number,
      required: [true, 'tahun_produksi wajib diisi'],
    }
  },
  { timestamps: true }
);


const Kendaraan = mongoose.model('Resep', kendaraanSchema, 'data_kendaraan');

export default Kendaraan;