const messagesModel = require('../models/messages.model');

const checkMessageId = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const idNumerico = Number(messageId);

        if (isNaN(idNumerico)) {
            return res.status(400).json({ message: 'El ID proporcionado no es un número válido.' });
        }

        const mensaje = await messagesModel.getById(idNumerico);

        if (!mensaje) {
            return res.status(404).json({
                message: `El mensaje con ID ${messageId} no existe en la base de datos.`
            });
        }

        req.mensajeEncontrado = mensaje;
        next();

    } catch (error) {
        console.error('Error en el middleware checkMessageId:', error);
        res.status(500).json({ message: 'Error interno en el servidor al validar el ID del mensaje.' });
    }
};

module.exports = { checkMessageId };