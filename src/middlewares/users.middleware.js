const usersModel = require('../models/users.models'); // Ajusta la ruta según tu estructura de carpetas

/**
 * Middleware para validar si un usuario existe por su ID antes de continuar
 */
const checkUserId = async (req, res, next) => {
    try {
        // Capturamos el userId de los parámetros de la URL (req.params)
        const { userId } = req.params;

        // Consultamos al modelo si existe el registro
        const usuario = await usersModel.getById(userId);
        req.usuarioEncontrado = usuario; // 👈 Guarda el objeto limpio en la petición.

        // Si el usuario no existe, cortamos la petición aquí mismo y devolvemos 404
        if (!usuario) {
            return res.status(404).json({
                message: `El usuario con ID ${userId} no existe en la base de datos.`
            });
        }

        // Inyectamos el usuario directamente en el objeto 'req' 
        // para que el controlador no tenga que volver a hacer la consulta a la DB
        req.usuarioEncontrado = usuario;

        // Todo está correcto, damos paso al siguiente eslabón (el controlador)
        next();

    } catch (error) {
        console.error('Error en el middleware checkUserId:', error);
        res.status(500).json({
            message: 'Error interno en el servidor al validar el ID del usuario.'
        });
    }
};

module.exports = {
    checkUserId
};