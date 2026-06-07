const pool = require('../config/db');

getAll = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM articulos');
        return rows;
    } catch (error) {
        console.error('Error al obtener los artículos GetAll:', error);
        throw error;
    }   };

getUserArticles = async (userId) => {
    try {
        const [rows] = await pool.query('SELECT * FROM articulos WHERE usuarios_id = ?', [userId]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los artículos del usuario:', error);
        throw error;
    }
};

module.exports = {
    getAll,
    getUserArticles
};