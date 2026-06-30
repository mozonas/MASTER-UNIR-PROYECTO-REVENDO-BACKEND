const db = require("../config/db");

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
      console.error("Error al contar reportes pendientes de artículos:", error);
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
      console.error(
        "Error al contar reportes pendientes de mensajería:",
        error,
      );
      throw error;
    }
  },

  createReport: async (articuloId, motivo, idTipoReporte, usuarioId) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [reportResult] = await conn.query(
        `INSERT INTO reportes (motivo, estado, fecha, id_tipo_reporte, articulos_id) VALUES (?, 'pendiente', NOW(), ?, ?)`,
        [motivo, idTipoReporte || null, articuloId],
      );
      const reporteId = reportResult.insertId;

      const [userCheck] = await conn.query(
        `SELECT id FROM usuarios WHERE id = ?`,
        [usuarioId],
      );
      if (userCheck.length > 0) {
        await conn.query(
          `INSERT INTO usuarios_tiene_reportes (usuarios_id, reportes_id) VALUES (?, ?)`,
          [usuarioId, reporteId],
        );
      }

      await conn.query(
        `INSERT INTO articulos_tiene_reportes (articulos_id, reportes_id) VALUES (?, ?)`,
        [articuloId, reporteId],
      );

      await conn.query(
        `UPDATE articulos SET estadoVenta = 'EN_REVISION' WHERE id = ?`,
        [articuloId],
      );

      await conn.commit();
      return reporteId;
    } catch (error) {
      await conn.rollback();
      console.error("Error al crear el reporte:", error);
      throw error;
    } finally {
      conn.release();
    }
  },

  createReportUsuario: async (motivo, usuarioId, articuloId) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [reportResult] = await conn.query(
        `INSERT INTO reportes (motivo, estado, fecha, articulos_id) VALUES (?, 'pendiente', NOW(), ?)`,
        [motivo, articuloId],
      );
      const reporteId = reportResult.insertId;

      await conn.query(
        `INSERT INTO usuarios_tiene_reportes (usuarios_id, reportes_id) VALUES (?, ?)`,
        [usuarioId, reporteId],
      );

      await conn.commit();
      return reporteId;
    } catch (error) {
      await conn.rollback();
      console.error("Error al crear reporte de usuario:", error);
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
      console.error("Error al obtener artículos en revisión:", error);
      throw error;
    }
  },

  resolveReport: async (reporteId, accion, moderadorId) => {
    const conn = await db.getConnection();
    try {
      const nuevoEstadoReporte = accion === 'aprobar' ? 'retirado' : 'activo';
      const nuevoEstadoArticulo = accion === 'aprobar' ? 'RETIRADO' : 'DISPONIBLE';

      await conn.beginTransaction();

      const [articulos] = await conn.query(
        `SELECT a.id AS articulo_id, a.titulo, a.usuarios_id AS propietario_id, t.tipo AS tipo_reporte
         FROM articulos a
         INNER JOIN articulos_tiene_reportes atr ON a.id = atr.articulos_id
         INNER JOIN reportes r ON r.id = atr.reportes_id
         LEFT JOIN tipo_reporte t ON t.id = r.id_tipo_reporte
         WHERE atr.reportes_id = ?
         LIMIT 1`,
        [reporteId]
      );
      const articulo = articulos[0];

      await conn.query(
        `UPDATE articulos a
         INNER JOIN articulos_tiene_reportes atr ON a.id = atr.articulos_id
         SET a.estadoVenta = ?
         WHERE atr.reportes_id = ?`,
        [nuevoEstadoArticulo, reporteId]
      );

      await conn.query(
        `UPDATE reportes SET estado = ? WHERE id = ?`,
        [nuevoEstadoReporte, reporteId]
      );

      if (articulo && moderadorId) {
        const motivoReporte = articulo.tipo_reporte || 'sin motivo especificado';
        const contenido = accion === 'aprobar'
          ? `Tu artículo "${articulo.titulo}" ha sido retirado de la plataforma tras la revisión de un reporte. Motivo del reporte: ${motivoReporte}.`
          : `Tu artículo "${articulo.titulo}" fue reportado, pero tras la revisión de un moderador se ha comprobado que cumple las normas y sigue disponible en la plataforma.`;

        await conn.query(
          `INSERT INTO mensajes (titulo, contenido, fecha, usuarios_id, articulos_id) VALUES (?, ?, NOW(), ?, ?)`,
          ['Notificación de moderación', contenido, moderadorId, articulo.articulo_id]
        );
      }

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      console.error('Error al resolver el reporte:', error);
      throw error;
    } finally {
      conn.release();
    }
  },

  resolveReportChat: async (reporteId, accion) => {
    const conn = await db.getConnection();
    try {
      const nuevoEstado = accion === "archivar" ? "activo" : "retirado";

      await conn.beginTransaction();

      await conn.query(`UPDATE reportes SET estado = ? WHERE id = ?`, [
        nuevoEstado,
        reporteId,
      ]);

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      console.error("Error al resolver la incidencia de chat:", error);
      throw error;
    } finally {
      conn.release();
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
      console.error("Error en getPendingArticles:", error);
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
      console.error("Error en getArticlesHistory:", error);
      throw error;
    }
  },

  getPendingChats: async () => {
    try {
      const [rows] = await db.query(`
                SELECT r.id, r.fecha, r.motivo, r.estado, r.created_at, u.usuario,
                u.id as usuarios_id, r.articulos_id
                FROM reportes r
                INNER JOIN usuarios_tiene_reportes utr ON r.id = utr.reportes_id
                INNER JOIN usuarios u ON utr.usuarios_id = u.id
                WHERE r.estado = 'pendiente'
                ORDER BY r.created_at DESC
            `);
      return rows;
    } catch (error) {
      console.error("Error relacional en getPendingChats:", error);
      throw error;
    }
  },

  getChatsHistory: async () => {
    try {
      const [rows] = await db.query(`
                SELECT r.id, r.fecha, r.motivo, r.estado, r.created_at, u.usuario,
                u.id as usuarios_id, r.articulos_id
                FROM reportes r
                INNER JOIN usuarios_tiene_reportes utr ON r.id = utr.reportes_id
                INNER JOIN usuarios u ON utr.usuarios_id = u.id
                WHERE r.estado IN ('activo', 'retirado')
                ORDER BY r.created_at DESC
            `);
      return rows;
    } catch (error) {
      console.error("Error relacional en getChatsHistory:", error);
      throw error;
    }
  },
};

const getDailyReports = async () => {
  const [result] = await db.query(`
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
  return result;
};

const getWeeklyReports = async () => {
  const [result] = await db.query(`
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
  return result;
};

const getMonthlyReports = async () => {
  const [result] = await db.query(`
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
  return result;
};

const getReportTypes = async (categoria) => {
  const [result] = await db.query(
    `
        SELECT id, tipo FROM tipo_reporte WHERE categoria='${categoria}' ORDER BY tipo ASC;`,
  );
  console.log([result]);

  return result;
};

module.exports = {
  ...Report,
  getDailyReports,
  getMonthlyReports,
  getWeeklyReports,
  getReportTypes,
};