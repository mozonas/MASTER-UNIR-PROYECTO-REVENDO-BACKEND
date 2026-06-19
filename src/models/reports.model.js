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

const getDailyReports = async () =>{
    const [result]= await db.query(`
        SELECT 
          r.fecha,
          r.motivo,
          a.titulo AS articulo_reportado,
          u.usuario
        FROM reportes r
        INNER JOIN articulos_tiene_reportes ar ON ar.reportes_id = r.id
        INNER JOIN articulos a ON a.id = ar.articulos_id
        INNER JOIN usuarios u ON u.id = a.usuarios_id
        WHERE DATE(r.fecha) = CURDATE()
        ORDER BY r.fecha DESC
        `);
        return result
}
const getWeeklyReports = async () =>{
    const [result]= await db.query(`
        SELECT 
          r.fecha,
          r.motivo,
          a.titulo AS articulo_reportado,
          u.usuario
        FROM reportes r
        INNER JOIN articulos_tiene_reportes ar ON ar.reportes_id = r.id
        INNER JOIN articulos a ON a.id = ar.articulos_id
        INNER JOIN usuarios u ON u.id = a.usuarios_id
        WHERE r.fecha >= CURDATE() - INTERVAL 7 DAY
        ORDER BY r.fecha DESC
    `);
    return result
}
const getMonthlyReports = async  () =>{
    const [result]= await db.query(`
        SELECT 
          r.fecha,
          r.motivo,
          a.titulo AS articulo_reportado,
          u.usuario
        FROM reportes r
        INNER JOIN articulos_tiene_reportes ar ON ar.reportes_id = r.id
        INNER JOIN articulos a ON a.id = ar.articulos_id
        INNER JOIN usuarios u ON u.id = a.usuarios_id
        WHERE MONTH(r.fecha) = MONTH(CURRENT_DATE())
        ORDER BY r.fecha DESC
    `);
    return result
}


module.exports = { ...Report, getDailyReports, getMonthlyReports, getWeeklyReports};
     