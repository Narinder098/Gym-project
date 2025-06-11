import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  totalPrice: Number,
  status: { type: String, default: 'Pending', enum: ['Pending', 'Shipped', 'Delivered'] },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);