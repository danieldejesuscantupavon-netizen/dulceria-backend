const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const productosDemo = [
  { nombre: 'Carlos V', precio: 18, categoria: 'chocolates', imagen: 'https://www.laranitadelapaz.com.mx/images/thumbs/0004975_chocolate-carlos-v-16-tabletas-de-20-g-ieps-inc_625.jpeg', stock: 100 },
  { nombre: "Hershey's", precio: 22.5, categoria: 'chocolates', imagen: 'https://images.albertsons-media.com/is/image/ABS/101011698-C1N1?$ng-ecom-pdp-desktop$&defaultImage=Not_Available', stock: 100 },
  { nombre: 'Panditas', precio: 18, categoria: 'gomitas', imagen: 'https://i5.walmartimages.com/asr/9d90cbd5-bde9-499c-a1c1-71081be1eba3.77c1814f5fc0f6836c55bbe73b9541b3.jpeg', stock: 100 },
  { nombre: 'Rockaleta', precio: 9, categoria: 'paletas', imagen: 'https://basicos.mayoreoenlinea.mx/cdn/shop/products/7501011135055.jpg', stock: 100 },
  { nombre: 'Mazapan', precio: 6, categoria: 'dulces_regionales', imagen: 'https://tiendadelarosa.com/cdn/shop/products/Disenosintitulo-2021-05-20T163304.109_23c5de19-c79c-499b-bf75-8378be91896b_900x.png', stock: 100 },
  { nombre: 'Oreo', precio: 18, categoria: 'galletas', imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFqpojyg5bxVAo5xKR-s1Pm2xR07ZkvA3CTw&s', stock: 100 }
];

router.post('/sample', async (req, res) => {
  try {
    const seedToken = process.env.SEED_TOKEN;
    const tokenRecibido = req.header('x-seed-token');

    if (!seedToken) {
      return res.status(400).json({ mensaje: 'SEED_TOKEN no esta configurado en el servidor' });
    }
    if (!tokenRecibido || tokenRecibido !== seedToken) {
      return res.status(401).json({ mensaje: 'Token invalido para seed' });
    }

    await Product.deleteMany({});
    await Product.insertMany(productosDemo);

    return res.status(201).json({
      mensaje: 'Productos demo cargados exitosamente',
      total: productosDemo.length
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al cargar productos demo', error: error.message });
  }
});

module.exports = router;
