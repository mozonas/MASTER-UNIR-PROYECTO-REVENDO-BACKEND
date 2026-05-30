const db = require('../config/db');

const getAll = async () => {
    const [rows] = await db.query('SELECT * FROM usuarios');
    return rows;
}

const getById = async (id) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0];
}

module.exports = { getAll, getById };