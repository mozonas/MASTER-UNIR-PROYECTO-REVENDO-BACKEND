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
    },

    getPendingArticles: async () => {
        try {
            const [rows] = await db.query(`
                SELECT 
                    r.id, 
                    r.fecha, 
                    r.motivo, 
                    r.estado, 
                    r.created_at, 
                    a.titulo
                FROM reportes r
                INNER JOIN articulos_tiene_reportes atr ON r.id = atr.reportes_id
                INNER JOIN articulos a ON atr.articulos_id = a.id
                WHERE r.estado = 'pendiente'
                ORDER BY r.created_at DESC
            `);
            return rows;
        } catch (error) {
            console.error('Error en getPendingArticles:', error);
            throw error;
        }
    },

    getArticlesHistory: async () => {
        try {
            const [rows] = await db.query(`
                SELECT 
                    r.id, 
                    r.fecha, 
                    r.motivo, 
                    r.estado, 
                    r.created_at, 
                    a.titulo
                FROM reportes r
                INNER JOIN articulos_tiene_reportes atr ON r.id = atr.reportes_id
                INNER JOIN articulos a ON atr.articulos_id = a.id
                WHERE r.estado IN ('activo', 'retirado')
                ORDER BY r.created_at DESC
            `);
            return rows;
        } catch (error) {
            console.error('Error en getArticlesHistory:', error);
            throw error;
        }
    },

    getPendingChats: async () => {
        try {
            const [rows] = await db.query(`
                SELECT r.id, r.fecha, r.motivo, r.estado, r.created_at, u.usuario
                FROM reportes r
                INNER JOIN usuarios_tiene_reportes utr ON r.id = utr.reportes_id
                INNER JOIN usuarios u ON utr.usuarios_id = u.id
                WHERE r.estado = 'pendiente'
                ORDER BY r.created_at DESC
            `);
            return rows;
        } catch (error) {
            console.error('Error relacional en getPendingChats:', error);
            throw error;
        }
    },

    getChatsHistory: async () => {
        try {
            const [rows] = await db.query(`
                SELECT r.id, r.fecha, r.motivo, r.estado, r.created_at, u.usuario
                FROM reportes r
                INNER JOIN usuarios_tiene_reportes utr ON r.id = utr.reportes_id
                INNER JOIN usuarios u ON utr.usuarios_id = u.id
                WHERE r.estado IN ('activo', 'retirado')
                ORDER BY r.created_at DESC
            `);
            return rows;
        } catch (error) {
            console.error('Error relacional en getChatsHistory:', error);
            throw error;
        }
    }

};

module.exports = Report;