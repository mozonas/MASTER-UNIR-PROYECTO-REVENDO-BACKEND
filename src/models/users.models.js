const db = require('../confing/db'); // Mantenemos tu configuración original

// ==========================================
// 📖 CONSULTAS DE LECTURA (READ)
// ==========================================

const getAll = async () => {
    const [rows] = await db.query('SELECT id, nombre, apellidos, email, usuario, foto, perfil, fecha_nacimiento, created_at FROM usuarios');
    return rows;
};

const getById = async (id) => {
    const [rows] = await db.query('SELECT id, nombre, apellidos, email, usuario, foto, perfil, fecha_nacimiento, created_at FROM usuarios WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return rows[0];
};

const getByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]); // Aquí sí traemos el password para el login
    if (rows.length === 0) return null;
    return rows[0];
};

const getByUsername = async (username) => {
    const [rows] = await db.query('SELECT id, nombre, apellidos, email, usuario, perfil FROM usuarios WHERE usuario = ?', [username]);
    if (rows.length === 0) return null;
    return rows[0];
};

const getPaginated = async (limit, offset) => {
    const [rows] = await db.query(
        'SELECT id, nombre, apellidos, email, usuario, foto, perfil FROM usuarios LIMIT ? OFFSET ?', 
        [parseInt(limit), parseInt(offset)]
    );
    return rows;
};

// ==========================================
// ✍️ OPERACIONES DE ESCRITURA (CREATE, UPDATE, DELETE)
// ==========================================

const create = async ({ nombre, apellidos, email, usuario, password, foto = null, perfil = 'USUARIO', fecha_nacimiento = null }) => {
    const [result] = await db.query(
        `INSERT INTO usuarios (nombre, apellidos, email, usuario, password, foto, perfil, fecha_nacimiento) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, apellidos, email, usuario, password, foto, perfil, fecha_nacimiento]
    );
    return { id: result.insertId, nombre, apellidos, email, usuario, perfil };
};

const updateById = async (id, { nombre, apellidos, email, usuario, foto, perfil, fecha_nacimiento }) => {
    const [result] = await db.query(
        `UPDATE usuarios 
         SET nombre = ?, apellidos = ?, email = ?, usuario = ?, foto = ?, perfil = ?, fecha_nacimiento = ? 
         WHERE id = ?`,
        [nombre, apellidos, email, usuario, foto, perfil, fecha_nacimiento, id]
    );
    return result.affectedRows > 0;
};

/**
 * Actualización Parcial (PATCH) - Cambia solo las propiedades que le envíes en el objeto 'fields'
 * Ej: patchById(16, { foto: 'nueva_foto.jpg' }) o { password: 'nuevo_hash' }
 */
const patchById = async (id, fields) => {
    const keys = Object.keys(fields);
    if (keys.length === 0) return false;

    const setQuery = keys.map(key => `${key} = ?`).join(', ');
    const values = Object.values(fields);
    values.push(id);

    const [result] = await db.query(`UPDATE usuarios SET ${setQuery} WHERE id = ?`, values);
    return result.affectedRows > 0;
};

const deleteById = async (id) => {
    const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

module.exports = { 
    getAll, 
    getById, 
    getByEmail,
    getByUsername,
    getPaginated,
    create, 
    updateById, 
    patchById,
    deleteById
};