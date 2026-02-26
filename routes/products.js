const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// OBTENER TODOS LOS PRODUCTOS (público)
router.get('/', async (req, res) => {
  try {
    const productos = await Product.find({ disponible: true });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
});

// OBTENER UN PRODUCTO POR ID (público) 
router.get('/:id', async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener producto', error: error.message });
  }
});

// CREAR PRODUCTO (solo admin) 
router.post('/', auth, async (req, res) => {
  try {
    // Verificar que sea admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para hacer esto' });
    }

    const { nombre, descripcion, precio, categoria, imagen, stock } = req.body;

    const producto = new Product({
      nombre,
      descripcion,
      precio,
      categoria,
      imagen,
      stock
    });

    await producto.save();
    res.status(201).json({ mensaje: 'Producto creado exitosamente', producto });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
  }
});

// EDITAR PRODUCTO (solo admin) 
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para hacer esto' });
    }

    const producto = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // devuelve el producto ya actualizado
    );

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto actualizado', producto });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
});

// ELIMINAR PRODUCTO (solo admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para hacer esto' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Producto eliminado exitosamente' });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
  }
});

module.exports = router;