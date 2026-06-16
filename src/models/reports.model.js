const db = require('../config/db');


const Report = {
    countPendingArticles: async () => {
        try {
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

    createReport: async (articuloId, motivo, usuarioId) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [reportResult] = await conn.query(
                `INSERT INTO reportes (motivo, estado, usuarios_id) VALUES (?, 'pendiente', ?)`,
                [motivo, usuarioId]
            );
            const reporteId = reportResult.insertId;

            await conn.query(
                `INSERT INTO articulos_tiene_reportes (articulos_id, reportes_id) VALUES (?, ?)`,
                [articuloId, reporteId]
            );

            await conn.query(
                `UPDATE articulos SET estadoVenta = 'EN_REVISION' WHERE id = ?`,
                [articuloId]
            );

            await conn.commit();
            return reporteId;
        } catch (error) {
            await conn.rollback();
            console.error('Error al crear el reporte:', error);
            throw error;
        } finally {
            conn.release();
        }
    },

    getArticlesInReview: async () => {
        try {
            const [rows] = await db.query(`
                SELECT
                    a.id,
                    a.titulo,
                    a.descripcion,
                    a.precio,
                    a.estadoVenta,
                    a.usuarios_id,
                    r.id AS reporte_id,
                    r.motivo,
                    r.estado AS reporte_estado,
                    r.created_at AS fecha_reporte,
                    f.url AS foto
                FROM articulos a
                INNER JOIN articulos_tiene_reportes atr ON a.id = atr.articulos_id
                INNER JOIN reportes r ON atr.reportes_id = r.id
                LEFT JOIN fotos f ON a.id = f.articulos_id
                WHERE r.estado = 'pendiente'
                ORDER BY r.created_at DESC
            `);
            return rows;
        } catch (error) {
            console.error('Error al obtener artículos en revisión:', error);
            throw error;
        }
    },

    resolveReport: async (reporteId, accion) => {
        try {
            const nuevoEstadoReporte = accion === 'aprobar' ? 'resuelto' : 'descartado';
            const nuevoEstadoArticulo = accion === 'aprobar' ? 'RETIRADO' : 'DISPONIBLE';

            const [result] = await db.query(
                `UPDATE reportes r
                 INNER JOIN articulos_tiene_reportes atr ON r.id = atr.reportes_id
                 SET r.estado = ?,
                     (SELECT estadoVenta FROM articulos WHERE id = atr.articulos_id LIMIT 1) = ?
                 WHERE r.id = ?`,
                [nuevoEstadoReporte, nuevoEstadoArticulo, reporteId]
            );

            await db.query(
                `UPDATE articulos a
                 INNER JOIN articulos_tiene_reportes atr ON a.id = atr.articulos_id
                 SET a.estadoVenta = ?
                 WHERE atr.reportes_id = ?`,
                [nuevoEstadoArticulo, reporteId]
            );

            await db.query(
                `UPDATE reportes SET estado = ? WHERE id = ?`,
                [nuevoEstadoReporte, reporteId]
            );

            return result;
        } catch (error) {
            console.error('Error al resolver el reporte:', error);
            throw error;
        }
    }
};

module.exports = Report;