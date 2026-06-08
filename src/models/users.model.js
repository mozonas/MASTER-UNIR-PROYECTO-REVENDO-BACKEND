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

// Función para obtener estadísticas de un usuario
const getStats = async (id) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM articulos WHERE usuarios_id = u.id AND estadoVenta = 'VENDIDO') AS total_vendidos,
            COUNT(v.id) AS total_valoraciones,
            IFNULL(ROUND(AVG(v.puntuacion), 1), 0.0) AS rating_media
        FROM usuarios u
        LEFT JOIN articulos a ON a.usuarios_id = u.id
        LEFT JOIN transacciones t ON t.articulos_id = a.id
        LEFT JOIN valoraciones v ON v.transacciones_id = t.id
        WHERE u.id = ?
        GROUP BY u.id;
    `;
    const [rows] = await db.query(query, [String(id)]);
    return rows[0];
}

module.exports = { getAll, getById, insert, selectByEmail, getStats };