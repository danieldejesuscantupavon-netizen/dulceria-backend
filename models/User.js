const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,  // campo obligatorio
    trim: true       // elimina espacios al inicio y al final
  },
  email: {
    type: String,
    required: true,
    unique: true,    // no puede haber dos usuarios con el mismo email
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['cliente', 'admin'],  // solo puede ser uno de estos dos valores
    default: 'cliente'           // por defecto todo usuario es cliente
  }
}, { timestamps: true }); // guarda automáticamente fecha de creación y actualización

module.exports = mongoose.model('User', userSchema);