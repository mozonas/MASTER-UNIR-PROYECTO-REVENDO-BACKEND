const db = require('../config/db');

//Implementación de las consultas necesarias para el modelo de mensages

const getByArticulo = async (articulos_id) => {
    const [rows] = await db.query(
        `SELECT m.*, u.nombre, u.apellidos, u.foto 
         FROM mensajes m
         JOIN usuarios u ON m.usuarios_id = u.id
         WHERE m.articulos_id = ?
         ORDER BY m.created_at ASC`,
        [articulos_id]
    );
    return rows;
}

const getByUsuario = async (usuarios_id) => {
    const [rows] = await db.query(
        `SELECT m.*, u.nombre, u.apellidos, u.foto, a.titulo as articulo_titulo
         FROM mensajes m
         JOIN usuarios u ON m.usuarios_id = u.id
         JOIN articulos a ON m.articulos_id = a.id
         WHERE m.articulos_id IN (
             SELECT DISTINCT articulos_id FROM mensajes WHERE usuarios_id = ?
         )
         ORDER BY m.created_at ASC`,
        [usuarios_id]
    );
    return rows;
}

const getById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM mensajes WHERE id = ?',
        [String(id)]
    );
    return rows[0];
}

const insert = async (mensaje) => {
    const { titulo, contenido, fecha, usuarios_id, articulos_id } = mensaje;
    const [result] = await db.query(
        'INSERT INTO mensajes (titulo, contenido, fecha, usuarios_id, articulos_id) VALUES (?, ?, ?, ?, ?)',
        [titulo, contenido, fecha, usuarios_id, articulos_id]
    );
    return result;
}

const remove = async (id) => {
    const [result] = await db.query(
        'DELETE FROM mensajes WHERE id = ?',
        [String(id)]
    );
    return result;
}

module.exports = { getByArticulo, getByUsuario, getById, insert, remove };