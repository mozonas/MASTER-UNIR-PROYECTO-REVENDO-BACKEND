const UserModel = require('../models/users.model');
const bcrypt = require('bcryptjs');

const getAll = async (req, res) => {
    try {
        const users = await UserModel.selectAll();
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
        // Extraemos el usuario inyectado limpiamente por el middleware
        const usuario = req.usuarioEncontrado;
        res.json(usuario);
    } catch (error) {
        console.error('Error en getById controller:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el usuario' });
    }
};

const create = async (req, res) => {
    // req.body -> { name: '...', email: '...', password: '...' }
    const result = await UserModel.insert(req.body)
    const newUser = await UserModel.selectById(result.insertId);

    if (!newUser) {
        return res.status(404).json({ message: 'No existe el usuario con ese ID' });
    }

    res.status(201).json(newUser);
}

const edit = async (req, res) => {
    // req.body 
    // req.params.userId
    const { body, params: { userId } } = req;

    const result = await UserModel.updateById(userId, body);
    const user = await UserModel.selectById(userId);

    res.json(user);
}

const remove = async (req, res) => {
    const { userId } = req.params;

    const result = await UserModel.deleteById(userId);

    res.json(req.user);
}

//31052026 - F4eature Login/SignUp
const register = async (req, res) => {
    // Body: username, email, password
    req.body.password = bcrypt.hashSync(req.body.password, 8);

    const result = await UserModel.insert(req.body);
    res.json({
        message: 'Registro completo'
    });
}

module.exports = {
    getAll, getById, create, edit, remove, register
}