const db = require('../config/db');


const Report = {
    countPendingArticles: async () => {

        try {
            // Contar reportes pendientes de artículos
            const [rows] = await db.query(`
                SELECT COUNT(*) AS total
                FROM reportes r
                INNER JOIN articulos_tiene_reportes atr ON r.id = atr.reportes_id
                WHERE r.estado = 'pendiente'
            `);
            const articlesRows = rows[0];
            return articlesRows ? articlesRows.total : 0;
        } catch (error) {
            console.error('Error al contar reportes pendientes de artículos:', error);
            throw error;
        }
    },

    countPendingChats: async () => {
        try {
            // Contar reportes pendientes de mensajeria
            const [rows] = await db.query(`
                SELECT COUNT(*) AS total
                FROM reportes r
                INNER JOIN usuarios_tiene_reportes mtr ON r.id = mtr.reportes_id
                WHERE r.estado = 'pendiente'
            `);
            const chatsRows = rows[0];
            return chatsRows ? chatsRows.total : 0;
        } catch (error) {
            console.error('Error al contar reportes pendientes de mensajería:', error);
            throw error;
        }
    }
}

    module.exports = Report;