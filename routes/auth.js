const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTRO
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const nombreNormalizado = (nombre || '').trim();
    const emailNormalizado = (email || '').trim().toLowerCase();

    if (!nombreNormalizado || !emailNormalizado || !password) {
      return res.status(400).json({ mensaje: 'Nombre, email y contrasena son obligatorios' });
    }

    // Verificar si el email ya esta registrado
    const usuarioExiste = await User.findOne({ email: emailNormalizado });
    if (usuarioExiste) {
      return res.status(400).json({ mensaje: 'El email ya esta registrado' });
    }

    // Encriptar la contrasena
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptado = await bcrypt.hash(password, salt);

    const usuario = new User({
      nombre: nombreNormalizado,
      email: emailNormalizado,
      password: passwordEncriptado
    });

    await usuario.save();

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailNormalizado = (email || '').trim().toLowerCase();

    if (!emailNormalizado || !password) {
      return res.status(400).json({ mensaje: 'Email y contrasena son obligatorios' });
    }

    // Buscar el usuario por email
    const usuario = await User.findOne({ email: emailNormalizado });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Email o contrasena incorrectos' });
    }

    // Comparar la contrasena con la encriptada
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ mensaje: 'Email o contrasena incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
});

module.exports = router;
