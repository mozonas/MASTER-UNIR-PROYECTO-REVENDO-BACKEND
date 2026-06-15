const pool = require("../config/db");

const articleInfo = `
  SELECT
    a.id AS id,
    a.titulo,
    a.descripcion,
    a.precio,
    a.estadoVenta,
    a.estadoProducto,
    a.tipoEntrega,
    a.tipoPago,
    a.created_at,
    a.usuarios_id,
    a.categorias_id,
    f.url AS foto,
    atr.reportes_id AS estado_reporte
  FROM articulos a
  LEFT JOIN fotos f ON a.id = f.articulos_id
  LEFT JOIN articulos_tiene_reportes atr ON a.id = atr.articulos_id`;

getAll = async () => {
  try {
    const [rows] = await pool.query(articleInfo);
    return rows;
  } catch (error) {
    console.error("Error al obtener los artículos GetAll:", error);
    throw error;
  }
};

getUserArticles = async (userId) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM articulos WHERE usuarios_id = ?",
      [userId],
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener los artículos del usuario:", error);
    throw error;
  }
};

getArticle = async (id) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
a.*, u.nombre AS nombre_vendedor, 
u.apellidos AS apellidos_vendedor, 
u.email AS email_vendedor, 
u.usuario AS usuario_vendedor, 
u.direccion AS direccion_vendedor, 
u.isBlocked AS isBlocked_vendedor, 
u.perfil AS perfil_vendedor,
c.nombre AS categoria
FROM articulos a 
INNER JOIN usuarios u
    ON u.id = a.usuarios_id 
INNER JOIN categorias c
    ON a.categorias_id = c.id where a.id = ?`,
      [id],
    );
    console.log("Artículo obtenido:", rows[0]);
    return rows[0];
  } catch (error) {
    console.error("Error al obtener el artículo:", error);
    throw error;
  }
};

module.exports = {
  getAll,
  getUserArticles,
  getArticle,
};
