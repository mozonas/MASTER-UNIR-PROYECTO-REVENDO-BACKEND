const UserModel = require('../models/users.model');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const getAll = async (req, res) => {
    try {
        const users = await UserModel.getAll();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Hay un error gravísimo'
        });
    }
}

const getById = async (req, res) => {
    try {
        // Extraemos el usuario inyectado limpiamente por el middleware checkUserId
        const usuario = req.usuarioEncontrado;
        res.json(usuario);
    } catch (error) {
        console.error('Error en getById controller:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el usuario' });
    }
};

const create = async (req, res) => {
    try {
        const result = await UserModel.insert(req.body);
        const newUser = await UserModel.getById(result.insertId);

        if (!newUser) {
            return res.status(404).json({ message: 'No existe el usuario con ese ID' });
        }
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
}

const edit = async (req, res) => {
    try {
        const { userId } = req.params;
        const { nombre, apellidos, email, usuario, fecha_nacimiento, perfil, direccion, descripcion } = req.body;

        // Usuario actual del middleware (checkUserId)
        const usuarioActual = req.usuarioEncontrado;

        // Si viene un archivo de Multer, usamos su nombre. Si no, dejamos la foto que ya tenía antes.
        let fotoFinal = usuarioActual.foto;
        if (req.file) {
            fotoFinal = req.file.filename;
        }

        await db.query(
            `UPDATE usuarios 
             SET nombre = ?, apellidos = ?, email = ?, usuario = ?, foto = ?, fecha_nacimiento = ?, perfil = ?, direccion = ?, descripcion = ? 
             WHERE id = ?`,
            [
                nombre || null,
                apellidos || null,
                email || null,
                usuario || null,
                fotoFinal,
                fecha_nacimiento || null,
                perfil || 'USUARIO',
                direccion || null,
                descripcion || null,
                userId
            ]
        );

        // Recuperamos el usuario actualizado usando el método real del modelo
        const userUpdated = await UserModel.getById(userId);
        res.json({ message: 'Usuario actualizado correctamente', user: userUpdated });

    } catch (error) {
        console.error('Error en edit controller:', error);
        res.status(500).json({ message: 'Error interno en el servidor al actualizar el usuario' });
    }
}

const remove = async (req, res) => {
    try {
        const { userId } = req.params;

        // Borrado directo en la base de datos
        await db.query('DELETE FROM usuarios WHERE id = ?', [userId]);
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
}

//31052026 - F4eature Login/SignUp
const register = async (req, res) => {
    try {
        // Body: username, email, password
        req.body.password = bcrypt.hashSync(req.body.password, 8);

        const result = await UserModel.insert(req.body);
        res.json({
            message: 'Registro completo'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el registro' });
    }
}

// Nueva función controladora para la ruta de estadísticas
const getStatistics = async (req, res) => {
    try {
        const { userId } = req.params;
        const stats = await UserModel.getStats(userId);

        // Si el usuario no tiene ninguna interacción aún, devolvemos contadores a cero de forma segura
        if (!stats) {
            return res.json({
                total_vendidos: 0,
                total_valoraciones: 0,
                rating_media: 0.0
            });
        }

        res.json(stats);
    } catch (error) {
        console.error('Error en getStatistics controller:', error);
        res.status(500).json({ message: 'Error en el servidor al calcular estadísticas reales.' });
    }
}

module.exports = {
    getAll, getById, create, edit, remove, register, getStatistics
}