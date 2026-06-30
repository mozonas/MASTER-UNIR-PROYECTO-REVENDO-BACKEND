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
         MAX(u.id) as otro_usuario_id, 
         MAX(u.usuario) as usuario, 
         MAX(u.foto) as foto,
         (SELECT contenido FROM mensajes 
          WHERE articulos_id = a.id 
          ORDER BY created_at DESC LIMIT 1) as ultimo_mensaje,
         (SELECT created_at FROM mensajes 
          WHERE articulos_id = a.id 
          ORDER BY created_at DESC LIMIT 1) as fecha_ultimo_mensaje
         FROM articulos a
         JOIN usuarios u ON 
             u.id = CASE 
                 WHEN a.usuarios_id = ? THEN (
                     SELECT m2.usuarios_id FROM mensajes m2 
                     WHERE m2.articulos_id = a.id 
                     ORDER BY m2.created_at DESC LIMIT 1
                 )
                 ELSE a.usuarios_id 
             END
         WHERE a.usuarios_id = ? 
            OR a.id IN (
                SELECT DISTINCT articulos_id FROM mensajes WHERE usuarios_id = ?
            )
         GROUP BY a.id, a.titulo`,
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