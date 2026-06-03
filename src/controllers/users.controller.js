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
        const { nombre, apellidos, email, usuario, foto, fecha_nacimiento, perfil, direccion } = req.body;

        await db.query(
            `UPDATE usuarios 
             SET nombre = ?, apellidos = ?, email = ?, usuario = ?, foto = ?, fecha_nacimiento = ?, perfil = ?, direccion = ? 
             WHERE id = ?`,
            [
                nombre || null, 
                apellidos || null, 
                email || null, 
                usuario || null, 
                foto || null, 
                fecha_nacimiento || null, 
                perfil || 'USUARIO', 
                direccion || null, 
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
        
        // 🔄 Borrado directo en la base de datos
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

module.exports = {
    getAll, getById, create, edit, remove, register
}