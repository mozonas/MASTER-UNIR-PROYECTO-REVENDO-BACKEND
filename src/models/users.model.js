const db = require('../config/db');

const getAll = async () => {
    const [rows] = await db.query('SELECT * FROM usuarios');
    return rows;
}

const getById = async (id) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0];
}

const insert = async (user) => { 
    const { nombre, apellidos, email, usuario, password, foto, fecha_nacimiento, direccion} = user;
    const [result] = await db.query('INSERT INTO usuarios (nombre, apellidos, email, usuario, password, foto, fecha_nacimiento, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [nombre, apellidos, email, usuario, password, foto, fecha_nacimiento, direccion]);
    
    return result;
}
module.exports = { getAll, getById, insert };