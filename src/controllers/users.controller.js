const usersModel = require('../models/users.models'); // Ajusta la ruta si tu modelo está en otra carpeta

// 1. Obtener todos los usuarios
const getAll = async (req, res) => {
    try {
        const usuarios = await usersModel.getAll();
        res.json(usuarios);
    } catch (error) {
        console.error('Error en getAll controller:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener usuarios' });
    }
};

// 2. Obtener un usuario por su ID
const getById = async (req, res) => {
    try {
        // El middleware 'checkUserId' ya verificó que existe y guardó el objeto limpio aquí
        const usuario = req.usuarioEncontrado;

        // Lo enviamos directamente a Angular tal cual viene de la DB
        res.json(usuario);
    } catch (error) {
        console.error('Error en getById controller:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el usuario' });
    }
};

// 3. Obtener un usuario por Email
const getByEmail = async (req, res) => {
    try {
        const { userEmail } = req.params;
        const usuario = await usersModel.getByEmail(userEmail);

        if (!usuario) {
            return res.status(404).json({ message: `Usuario con email ${userEmail} no encontrado` });
        }

        res.json(usuario);
    } catch (error) {
        console.error('Error en getByEmail controller:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// 4. Crear un nuevo usuario
const create = async (req, res) => {
    try {
        // req.body contiene el JSON validado que envía el frontend
        const nuevoUsuario = await usersModel.create(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error en create controller:', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

// 5. Editar un usuario (PUT)
const edit = async (req, res) => {
    try {
        const { userId } = req.params;

        // Ya sabemos que el usuario existe gracias al middleware,
        // así que ejecutamos la actualización directamente sin ifs adicionales de existencia.
        await usersModel.updateById(userId, req.body);

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error en edit controller:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

// 6. Eliminar un usuario (DELETE)
const remove = async (req, res) => {
    try {
        const { userId } = req.params;

        // El middleware ya garantizó que el ID es real,
        // procedemos al borrado directo de la base de datos.
        await usersModel.deleteById(userId);

        res.json({ message: 'Usuario eliminado correctamente de la base de datos' });
    } catch (error) {
        console.error('Error en remove controller:', error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};

// Exportamos las funciones mapeadas con tu archivo de rutas
module.exports = {
    getAll,
    getById,
    getByEmail,
    create,
    edit,
    remove
};