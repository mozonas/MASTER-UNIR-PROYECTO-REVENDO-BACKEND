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

const getAll = async () => {
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

/**
 *
 */
const getArticle = async (id) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
a.*,
c.nombre AS categoria,
d.direccion AS calle_direccion_vendedor, 
d.codigo_postal AS cp_direccion_vendedor, 
d.ciudad AS ciudad_direccion_vendedor, 
d.provincia AS provincia_direccion_vendedor, 
d.pais AS pais_direccion_vendedor
FROM articulos a 
INNER JOIN categorias c
    ON a.categorias_id = c.id 
INNER JOIN usuarios u
    ON u.id = a.usuarios_id 
INNER JOIN direcciones d
    ON d.usuario_id = u.id 
 where a.id = ?`,
      [id],
    );
    console.log("Artículo obtenido:", rows[0]);
    if (rows[0] === undefined) {
      console.error("Artículo no encontrado");
      //throw new Error("Artículo no encontrado");
    }
    return rows[0];
  } catch (error) {
    console.error("Error al obtener el artículo:", error);
    throw error;
  }
};

/**
 *
 */
const getArticleFotos = async (id) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
f.url,
f.nombreAlt
FROM fotos f
 where f.articulos_id = ?`,
      [id],
    );
    console.log("Fotos del artículo obtenidas:", rows);
    if (rows === undefined) {
      console.error("Fotos del artículo no encontradas");
    }
    return rows;
  } catch (error) {
    console.error("Error al obtener las fotos del artículo:", error);
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
const updateArticle = async (articleId, updatedData) => {
  try {
    const [result] = await pool.query("UPDATE articulos SET ? WHERE id = ?", [
      updatedData,
      articleId,
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error al actualizar el artículo:", error);
    throw error;
  }
};

const deleteArticle = async (articleId) => {
  try {
    const [result] = await pool.query("DELETE FROM articulos WHERE id = ?", [
      articleId,
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error al eliminar el artículo:", error);
    throw error;
  }
};

// mog 18062026 -> buscador de artículos / cargador de artículos desde la home
const searchArticles = async (filters) => {
  const {
    texto,
    categoria,
    estado,
    min,
    max,
    orden,
    page
  } = filters;

  const limit = 12;
  const offset = (page - 1) * limit;

  let where = `WHERE a.estadoVenta = 'DISPONIBLE'`;
  let params = [];

  // Texto en título o descripción
  if (texto) {
    where += ` AND (a.titulo LIKE ? OR a.descripcion LIKE ?)`;
    params.push(`%${texto}%`, `%${texto}%`);
  }

  // Categoría
  if (categoria) {
    where += ` AND a.categorias_id = ?`;
    params.push(categoria);
  }

  // Estado del producto
  if (estado) {
    where += ` AND a.estadoProducto = ?`;
    params.push(estado);
  }

  // Rango de precio
  where += ` AND a.precio BETWEEN ? AND ?`;
  params.push(min, max);

  // Ordenación
  let orderBy = `ORDER BY a.id DESC`;
  if (orden === "precio_asc") orderBy = `ORDER BY a.precio ASC`;
  if (orden === "precio_desc") orderBy = `ORDER BY a.precio DESC`;

  // SELECT principal
  const sql = `
    SELECT 
      a.id,
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
      c.nombre AS categoria,
      (
        SELECT f.url 
        FROM fotos f 
        WHERE f.articulos_id = a.id 
        ORDER BY f.id ASC 
        LIMIT 1
      ) AS foto
    FROM articulos a
    INNER JOIN categorias c ON c.id = a.categorias_id
    ${where}
    ${orderBy}
    LIMIT ${limit} OFFSET ${offset}
  `;

  // SELECT para contar total
  const sqlCount = `
    SELECT COUNT(*) AS total
    FROM articulos a
    ${where}
  `;

  const [items] = await pool.query(sql, params);
  const [count] = await pool.query(sqlCount, params);

  return {
    items,
    totalItems: count[0].total,
    totalPages: Math.ceil(count[0].total / limit),
    currentPage: page
  };
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
}
