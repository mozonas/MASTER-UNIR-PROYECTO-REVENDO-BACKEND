const MessageModel = require('../models/messages.model');

const getByArticulo = async (req, res) => {
    try {
        const { articuloId } = req.params;
        const mensajes = await MessageModel.getByArticulo(articuloId);
        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getByUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const conversaciones = await MessageModel.getByUsuario(usuarioId);
        res.json(conversaciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getById = async (req, res) => {
    try {
        const mensaje = await MessageModel.getById(req.params.messageId);
        res.json(mensaje);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const create = async (req, res) => {
    try {
        const nuevoMensaje = {
            titulo: req.body.titulo || 'Mensaje',
            contenido: req.body.contenido,
            fecha: new Date(),
            usuarios_id: req.body.usuarios_id,
            articulos_id: req.body.articulos_id
        };
        const result = await MessageModel.insert(nuevoMensaje);
        res.status(201).json({ id: result.insertId, ...nuevoMensaje });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await MessageModel.remove(req.params.messageId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getByArticulo, getByUsuario, getById, create, remove };