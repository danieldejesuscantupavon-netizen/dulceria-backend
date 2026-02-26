const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0  // el precio no puede ser negativo
  },
  categoria: {
    type: String,
    enum: [
        'gomitas', 'chocolates', 'paletas', 'dulces_regionales',
        'otros', 'chicle', 'caramelo', 'galletas',
        'halloween', 'navidad', 'san_valentin',
        'dia_del_nino', 'anio_nuevo', 'dia_de_reyes'
    ],
    default: 'otros'
},
  imagen: {
    type: String  // guardamos la URL de la imagen
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  disponible: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);