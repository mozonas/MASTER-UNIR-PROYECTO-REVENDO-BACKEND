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

const getValoraciones = async (id) => {
    const query = `
        SELECT 
            v.id AS valoracion_id,
            v.puntuacion,
            v.comentario,
            v.fecha AS fecha_valoracion,
            a.titulo AS articulo_titulo,
            u_comprador.usuario AS comprador_username,
            u_comprador.foto AS comprador_foto
        FROM valoraciones v
        JOIN transacciones t ON v.transacciones_id = t.id
        JOIN articulos a ON t.articulos_id = a.id
        JOIN usuarios u_comprador ON t.usuarios_id = u_comprador.id
        WHERE a.usuarios_id = ?  -- ID del usuario del perfil (Alejandro, por ejemplo)
        ORDER BY v.fecha DESC;
    `;
    const [rows] = await db.query(query, [String(id)]);
    return rows;
}

//mog 110626 -> Función para contar total de usuarios (para paginación)
const getAllPaginated = async (limit, offset) => {
    const [rows] = await db.query(
        'SELECT id, nombre, apellidos, email, usuario, foto, fecha_nacimiento, direccion, perfil,isBlocked FROM usuarios LIMIT ? OFFSET ?',
        [limit, offset]
    );
    return rows;
};

const countAll = async () => {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM usuarios');
    return rows[0].total;
};


// Eliminar usuario
const deleteUser = async (id) => {
    const [result] = await db.query(
        'DELETE FROM usuarios WHERE id = ?',
        [String(id)]
    );
    return result;
};

// Bloquear / desbloquear usuario
const toggleBlock = async (id, isBlocked) => {
    const [result] = await db.query(
        'UPDATE usuarios SET isBlocked = ? WHERE id = ?',
        [isBlocked, String(id)]
    );
    return result;
};


module.exports = { 
    getAll, 
    getById, 
    insert, 
    selectByEmail, 
    getStats, 
    getValoraciones, 
    getAllPaginated, 
    countAll,
    deleteUser,
    toggleBlock
};
