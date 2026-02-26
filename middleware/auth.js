const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Buscamos el token en el header de la petición
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Si no hay token, rechazamos la petición
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado, token requerido' });
  }

  try {
    // Verificamos que el token sea válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // guardamos los datos del usuario en la petición
    next(); // continuamos con la siguiente función
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido' });
  }
};