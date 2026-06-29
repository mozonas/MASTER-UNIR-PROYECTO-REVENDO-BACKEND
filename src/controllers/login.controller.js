const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/users.model');
require('dotenv').config();

const profile = (req, res) => {
    const { username, email, rol } = req.user;
    res.json({ username, email, rol });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.selectByEmail(email);
    if (!user) {
        return res.status(401).json({ message: 'Error email y/o contraseña' });
    }

    const iguales = bcrypt.compareSync(password, user.password);
    if (!iguales) {
        return res.status(401).json({ message: 'Error email y/o contraseña' });
    }
    
    //mog 290626 bloqueo de usuario
    // BLOQUEO
    if (user.isBlocked === 1) {
        return res.status(403).json({
            message: 'Cuenta bloqueada y en investigación'
        });
    }

    const token = jwt.sign(
        {
            userId: user.id,
            username: user.usuario,
            email: user.email,
            perfil: user.perfil
        },
        process.env.JWT_SECRET_KEY
    );



    res.json({
        message: 'Login correcto',
        token
    });
};

module.exports = {
    login,
    profile
};
