const db = require('../confing/db');

//Implementación de las consultas necesarias para el modelo de mensages

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
         u.id as otro_usuario_id, u.usuario, u.foto,
         (SELECT contenido FROM mensajes 
          WHERE articulos_id = a.id 
          ORDER BY created_at DESC LIMIT 1) as ultimo_mensaje,
         (SELECT created_at FROM mensajes 
          WHERE articulos_id = a.id 
          ORDER BY created_at DESC LIMIT 1) as fecha_ultimo_mensaje
         FROM mensajes m
         JOIN articulos a ON m.articulos_id = a.id
         JOIN usuarios u ON a.usuarios_id = u.id
         WHERE m.articulos_id IN (
             SELECT DISTINCT articulos_id FROM mensajes WHERE usuarios_id = ?
         )
         GROUP BY a.id`,
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