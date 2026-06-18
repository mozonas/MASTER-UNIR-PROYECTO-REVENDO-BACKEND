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

getUserArticles = async (userId, estado) => {
  try {
    let query = "SELECT * FROM articulos WHERE usuarios_id = ?";
    const params = [userId];

    if (estado && estado !== 'all') {
      query += ' AND estadoVenta = ?';
      params.push(estado);
    }

    const [rows] = await pool.query(query, params);
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

updateArticle = async (articleId, updatedData) => {
    try {
        const [result] = await pool.query('UPDATE articulos SET ? WHERE id = ?', [updatedData, articleId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar el artículo:', error);
        throw error;
    }

};

createArticle = async (articleData) => {
  try {
    const payload = {
      titulo: articleData.titulo,
      descripcion: articleData.descripcion,
      precio: articleData.precio,
      estadoVenta: articleData.estadoVenta || 'DISPONIBLE',
      estadoProducto: articleData.estadoProducto || null,
      tipoEntrega: articleData.tipoEntrega,
      tipoPago: articleData.tipoPago,
      usuarios_id: articleData.usuarios_id,
      categorias_id: articleData.categorias_id
    };
    const [result] = await pool.query('INSERT INTO articulos SET ?', [payload]);
    return result.insertId;
  } catch (error) {
    console.error('Error al crear el artículo:', error);
    throw error;
  }
};

getArticleEnums = async () => {
  try {
    const enumFields = ['estadoProducto', 'tipoEntrega', 'tipoPago'];
    const [rows] = await pool.query(
      `SELECT COLUMN_NAME, COLUMN_TYPE
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_NAME = 'articulos'
         AND COLUMN_NAME IN ('estadoProducto', 'tipoEntrega', 'tipoPago')
         AND TABLE_SCHEMA = DATABASE()`
    );

    const enums = {
      estadoProducto: [],
      tipoEntrega: [],
      tipoPago: []
    };

    for (const row of rows) {
      // COLUMN_TYPE looks like: enum('Nuevo','Como nuevo','Buen estado')
      const match = row.COLUMN_TYPE.match(/^enum\((.+)\)$/i);
      if (match && enumFields.includes(row.COLUMN_NAME)) {
        const values = [];
        const regex = /'((?:\\'|[^'])*)'/g;
        let result;

        while ((result = regex.exec(match[1])) !== null) {
          values.push(result[1].replace(/\\'/g, "'"));
        }

        enums[row.COLUMN_NAME] = values;
      }
    }

    return enums;
  } catch (error) {
    console.error('Error al obtener ENUMs del artículo:', error);
    throw error;
  }
};

deleteArticle = async (articleId) => {
    try {
        const [result] = await pool.query('UPDATE articulos SET estadoVenta = ? WHERE id = ?', ['BORRADO', articleId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar el artículo:', error);
        throw error;
    }
};

module.exports = {
    getAll,
    getUserArticles,
    createArticle,
    updateArticle,
    deleteArticle,
  getArticle,
  getArticleEnums

};