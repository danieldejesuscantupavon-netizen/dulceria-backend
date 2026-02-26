const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',      // referencia al modelo User
    required: true
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'  // referencia al modelo Product
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1
      },
      precioUnitario: {
        type: Number,
        required: true
      }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  direccionEntrega: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);