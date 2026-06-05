const pool = require('../config/db');



const countPendingArticles = async () => {

    try {
        // Contar reportes pendientes de artículos
        const [articlesRows] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM reportes r
            INNER JOIN articulos_tiene_reportes atr ON r.id = atr.reportes_id
            WHERE r.estado = 'pendiente'
        `);
        return articlesRows[0]?.total || 0;
    } catch (error) {
        console.error('Error al contar reportes pendientes de artículos:', error);
        throw error;
    }
};

const countPendingChats = async () => {
    try {
        // Contar reportes pendientes de mensajeria
        const [chatsRows] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM reportes r
            INNER JOIN usuarios_tiene_reportes mtr ON r.id = mtr.reportes_id
            WHERE r.estado = 'pendiente'
        `);
        return chatsRows[0]?.total || 0;
    } catch (error) {
        console.error('Error al contar reportes pendientes de mensajería:', error);
        throw error;
    }
};

module.exports = { countPendingArticles, countPendingChats };