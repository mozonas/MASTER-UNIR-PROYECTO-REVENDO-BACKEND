const db = require('../config/db');

const getAll = async () => {
    const [rows] = await db.query('SELECT * FROM usuarios');
    return rows;
}

const getById = async (id) => {
    // Forzamos la conversión a string dentro del array de parámetros por si mysql2 se confunde de tipo
    const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [String(id)]);
    return rows[0];
}

const insert = async (user) => {
    const { nombre, apellidos, email, usuario, password, foto, fecha_nacimiento, direccion } = user;
    const [result] = await db.query('INSERT INTO usuarios (nombre, apellidos, email, usuario, password, foto, fecha_nacimiento, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [nombre, apellidos, email, usuario, password, foto, fecha_nacimiento, direccion]);

    return result;
}

const selectByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
}

module.exports = { getAll, getById, insert, selectByEmail };