const UserModel = require('../models/users.model');

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

const getById = (req, res) => {
    res.json(req.user);
}

const create = async (req, res) => {
    // req.body -> nombre, apellidos, direccion, email, edad, genero, cuota, fecha_nacimiento, dni.
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

module.exports = {
    getAll, getById, create, edit, remove
}