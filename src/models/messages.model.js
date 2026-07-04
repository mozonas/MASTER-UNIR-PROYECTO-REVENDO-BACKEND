const db = require('../config/db');

//Implementación de las consultas necesarias para el modelo de mensajes

const getByArticulo = async (articulos_id) => {
    const [rows] = await db.query(
        `SELECT m.*, u.usuario, u.foto 
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
        `SELECT a.id as articulos_id, a.titulo,
         otro.id as otro_usuario_id, otro.usuario, otro.foto,
         lm.contenido as ultimo_mensaje,
         lm.created_at as fecha_ultimo_mensaje
         FROM articulos a
         JOIN (
             SELECT m1.articulos_id, m1.contenido, m1.created_at
             FROM mensajes m1
             WHERE m1.id = (
                 SELECT m2.id FROM mensajes m2
                 WHERE m2.articulos_id = m1.articulos_id
                 ORDER BY m2.created_at DESC, m2.id DESC LIMIT 1
             )
         ) lm ON lm.articulos_id = a.id
         JOIN usuarios otro ON otro.id = COALESCE(
             (SELECT m3.usuarios_id FROM mensajes m3
              WHERE m3.articulos_id = a.id AND m3.usuarios_id <> ?
              ORDER BY m3.created_at DESC, m3.id DESC LIMIT 1),
             a.usuarios_id
         )
         WHERE a.id IN (SELECT DISTINCT articulos_id FROM mensajes WHERE usuarios_id = ?)
            OR a.usuarios_id = ?`,
        [usuarios_id, usuarios_id, usuarios_id]
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