const db = require('../config/db');

// =====================================
//   OBTENER CATEGORÍAS PAGINADAS
// =====================================
const getAllPaginated = async (limit, offset) => {
    const [rows] = await db.query(
        'SELECT * FROM categorias ORDER BY nombre ASC LIMIT ? OFFSET ?',
        [limit, offset]
    );
    return rows;
};

// =====================================
//   CONTAR TODAS LAS CATEGORÍAS
// =====================================
const countAll = async () => {
    const [rows] = await db.query(
        'SELECT COUNT(*) AS total FROM categorias'
    );
    return rows[0].total;
};

// =====================================
//   CREAR CATEGORÍA
// =====================================
const insert = async (nombre) => {
    const [result] = await db.query(
        'INSERT INTO categorias (nombre) VALUES (?)',
        [nombre]
    );
    return result;
};

// =====================================
//   ACTUALIZAR CATEGORÍA
// =====================================
const update = async (id, nombre) => {
    const [result] = await db.query(
        'UPDATE categorias SET nombre = ? WHERE id = ?',
        [nombre, id]
    );
    return result;
};

// =====================================
//   ELIMINAR CATEGORÍA
// =====================================
const remove = async (id) => {
    const [result] = await db.query(
        'DELETE FROM categorias WHERE id = ?',
        [id]
    );
    return result;
};

const getByName = async (nombre) => {
    const [rows] = await db.query(
        'SELECT id, nombre FROM categorias WHERE LOWER(nombre) = LOWER(?) LIMIT 1',
        [nombre]
    );
    return rows[0] || null;
};

module.exports = {
    getAllPaginated,
    countAll,
    insert,
    update,
    remove,
    getByName
};
