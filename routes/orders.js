const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

//CREAR PEDIDO (usuario logueado)
router.post('/', auth, async (req, res) => {
  try {
    const { productos, direccionEntrega } = req.body;

    let total = 0;
    const productosDetalle = [];

    // Calcular el total y verificar stock
    for (const item of productos) {
      const producto = await Product.findById(item.productoId);

      if (!producto) {
        return res.status(404).json({ mensaje: `Producto no encontrado: ${item.productoId}` });
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ mensaje: `Stock insuficiente de: ${producto.nombre}` });
      }

      total += producto.precio * item.cantidad;
      productosDetalle.push({
        producto: producto._id,
        cantidad: item.cantidad,
        precioUnitario: producto.precio
      });

      // Reducir el stock
      producto.stock -= item.cantidad;
      await producto.save();
    }

    const pedido = new Order({
      usuario: req.usuario.id,
      productos: productosDetalle,
      total,
      direccionEntrega
    });

    await pedido.save();
    res.status(201).json({ mensaje: 'Pedido creado exitosamente', pedido });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear pedido', error: error.message });
  }
});

// VER MIS PEDIDOS (usuario logueado) 
router.get('/mispedidos', auth, async (req, res) => {
  try {
    const pedidos = await Order.find({ usuario: req.usuario.id })
      .populate('productos.producto', 'nombre precio imagen'); // trae los detalles del producto
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
  }
});

//  VER TODOS LOS PEDIDOS (solo admin) 
router.get('/', auth, async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para hacer esto' });
    }

    const pedidos = await Order.find()
      .populate('usuario', 'nombre email')
      .populate('productos.producto', 'nombre precio');
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
  }
});

module.exports = router;