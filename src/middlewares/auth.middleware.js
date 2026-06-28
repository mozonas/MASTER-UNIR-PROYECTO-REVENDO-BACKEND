/* const jwt = require('jsonwebtoken');

const checkAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Verificar rol
    if (decoded.perfil !== 'ADMIN') {
      return res.status(403).json({ message: 'Acceso denegado: no eres administrador' });
    }

    // Guardamos info del usuario por si hace falta
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = { checkAdminToken };
 */
// mog fix

const jwt = require('jsonwebtoken');

// Middleware para validar token de cualquier usuario
const checkAuthToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Guardamos info del usuario autenticado
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware para validar token SOLO de administradores
const checkAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.perfil !== 'ADMIN') {
      return res.status(403).json({ message: 'Acceso denegado: no eres administrador' });
    }

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = { checkAuthToken, checkAdminToken };
