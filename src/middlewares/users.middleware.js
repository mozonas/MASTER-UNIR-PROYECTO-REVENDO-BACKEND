const usersModel = require('../models/users.model');

const checkUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const idNumerico = Number(userId);

        if (isNaN(idNumerico)) {
            return res.status(400).json({ message: 'El ID proporcionado no es un número válido.' });
        }

        // Consultamos al modelo obligatorio simplificado
        const usuario = await usersModel.getById(idNumerico);

        if (!usuario) {
            return res.status(404).json({
                message: `El usuario con ID ${userId} no existe en la base de datos.`
            });
        }

        req.usuarioEncontrado = usuario;
        next();

    } catch (error) {
        console.error('Error en el middleware checkUserId:', error);
        res.status(500).json({ message: 'Error interno en el servidor al validar el ID del usuario.' });
    }
};

module.exports = { checkUserId };