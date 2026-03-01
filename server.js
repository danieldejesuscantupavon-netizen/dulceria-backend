const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!mongoUri) {
  console.error('Falta configurar MONGODB_URI (o MONGO_URI) en variables de entorno.');
  process.exit(1);
}

// Middlewares
app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  })
);
app.use(express.json());
app.use(express.static('public'));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/seed', require('./routes/seed'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Dulceria funcionando!' });
});

// Healthcheck para plataformas cloud
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(port, () => {
      console.log(`Servidor corriendo en puerto ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  });
