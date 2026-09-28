import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, default: 'Vegetables', trim: true },
    image: { type: String, default: '' },
    images: { type: [String], default: [], validate: { validator: (arr) => arr.length <= 5, message: 'Maximum 5 images allowed' } },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
