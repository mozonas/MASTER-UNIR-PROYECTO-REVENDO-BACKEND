const pool = require("../config/db");
const { selectByMonth } = require('./transactions.model');

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
    c.nombre AS categoria_nombre,
    (
      SELECT f.url
      FROM fotos f
      WHERE f.articulos_id = a.id
      ORDER BY f.id ASC
      LIMIT 1
    ) AS foto,
    (
      SELECT atr.reportes_id
      FROM articulos_tiene_reportes atr
      WHERE atr.articulos_id = a.id
      LIMIT 1
    ) AS estado_reporte
  FROM articulos a
  LEFT JOIN categorias c ON a.categorias_id = c.id
  WHERE a.estadoVenta <> 'BORRADO'`;

const getAll = async () => {
  try {
    const [rows] = await pool.query(articleInfo);
    return rows;
  } catch (error) {
    console.error("Error al obtener los artículos GetAll:", error);
    throw error;
  }
};

const parseMysqlEnumType = (columnType) => {
  if (!columnType) return [];

  const match = columnType.match(/^enum\((.*)\)$/i);
  if (!match) return [];

  return match[1]
    .split(",")
    .map((value) => value.trim().replace(/^'/, "").replace(/'$/, ""));
};

const getArticleEnums = async () => {
  const fields = ["estadoVenta", "estadoProducto", "tipoEntrega", "tipoPago"];

  try {
    const [rows] = await pool.query(
      `SHOW COLUMNS FROM articulos WHERE Field IN ('estadoVenta', 'estadoProducto', 'tipoEntrega', 'tipoPago')`,
    );

    const enumsByField = rows.reduce((acc, row) => {
      acc[row.Field] = parseMysqlEnumType(row.Type);
      return acc;
    }, {});

    return fields.reduce((acc, field) => {
      acc[field] = enumsByField[field] || [];
      return acc;
    }, {});
  } catch (error) {
    console.error("Error al obtener enums del artículo desde BBDD:", error);
    throw error;
  }
};

const getUserArticles = async (userId) => {
  try {
    const [rows] = await pool.query(
      `SELECT
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
        c.nombre AS categoria_nombre,
        (
          SELECT f.url
          FROM fotos f
          WHERE f.articulos_id = a.id
          ORDER BY f.id ASC
          LIMIT 1
        ) AS foto
      FROM articulos a
      LEFT JOIN categorias c ON a.categorias_id = c.id
      WHERE a.usuarios_id = ? AND a.estadoVenta <> 'BORRADO'
      ORDER BY a.id DESC`,
      [userId],
    );
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
COALESCE(d.direccion, '') AS calle_direccion_vendedor, 
COALESCE(d.codigo_postal, '') AS cp_direccion_vendedor, 
COALESCE(d.ciudad, '') AS ciudad_direccion_vendedor, 
COALESCE(d.provincia, '') AS provincia_direccion_vendedor, 
COALESCE(d.pais, '') AS pais_direccion_vendedor
FROM articulos a 
INNER JOIN categorias c
    ON a.categorias_id = c.id 
INNER JOIN usuarios u
    ON u.id = a.usuarios_id 
LEFT JOIN direcciones d
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

const updateArticle = async (articleId, requesterUserId, updatedData) => {
  const rawImages = Array.isArray(updatedData.images)
    ? updatedData.images
    : [
        updatedData.image1,
        updatedData.image2,
        updatedData.image3,
        updatedData.image4,
        updatedData.image5,
        updatedData.image,
      ];

  const images = rawImages
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => !!value)
    .slice(0, 5);

  const articlePayload = {
    titulo: updatedData.titulo,
    descripcion: updatedData.descripcion,
    precio: updatedData.precio,
    estadoProducto: updatedData.estadoProducto ?? null,
    tipoEntrega: updatedData.tipoEntrega,
    tipoPago: updatedData.tipoPago,
    categorias_id: updatedData.categorias_id,
  };

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query("UPDATE articulos SET ? WHERE id = ? AND usuarios_id = ?", [
      articlePayload,
      articleId,
      requesterUserId,
    ]);

    if (result.affectedRows > 0) {
      if (images.length) {
        await connection.query("DELETE FROM fotos WHERE articulos_id = ?", [articleId]);

        const altText = articlePayload.titulo || updatedData.titulo || "";
        for (const url of images) {
          await connection.query(
            "INSERT INTO fotos (url, nombreAlt, articulos_id) VALUES (?, ?, ?)",
            [url, altText, articleId],
          );
        }
      } else if (articlePayload.titulo) {
        await connection.query(
          "UPDATE fotos SET nombreAlt = ? WHERE articulos_id = ?",
          [articlePayload.titulo, articleId],
        );
      }
    }

    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error("Error al actualizar el artículo:", error);
    throw error;
  } finally {
    connection.release();
  }
};

const createArticle = async (articleData) => {
  const rawImages = Array.isArray(articleData.images)
    ? articleData.images
    : [
        articleData.image1,
        articleData.image2,
        articleData.image3,
        articleData.image4,
        articleData.image5,
        articleData.image,
      ];

  const images = rawImages
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => !!value)
    .slice(0, 5);

  if (!images.length) {
    const validationError = new Error("La primera imagen es obligatoria");
    validationError.statusCode = 400;
    throw validationError;
  }

  const connection = await pool.getConnection();
  try {
    const payload = {
      titulo: articleData.titulo,
      descripcion: articleData.descripcion,
      precio: articleData.precio,
      estadoVenta: articleData.estadoVenta || 'DISPONIBLE',
      estadoProducto: articleData.estadoProducto ?? null,
      tipoEntrega: articleData.tipoEntrega,
      tipoPago: articleData.tipoPago,
      created_at: articleData.created_at || new Date(),
      usuarios_id: articleData.usuarios_id,
      categorias_id: articleData.categorias_id,
    };

    await connection.beginTransaction();
    const [result] = await connection.query("INSERT INTO articulos SET ?", [payload]);

    const fotosRows = images.map((url) => [url, articleData.titulo, result.insertId]);
    for (const fotoRow of fotosRows) {
      await connection.query(
        "INSERT INTO fotos (url, nombreAlt, articulos_id) VALUES (?, ?, ?)",
        fotoRow,
      );
    }

    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    console.error("Error al crear el artículo:", error);
    throw error;
  } finally {
    connection.release();
  }
};

const deleteArticle = async (articleId, requesterUserId) => {
  try {
    const [result] = await pool.query(
      "UPDATE articulos SET estadoVenta = 'BORRADO' WHERE id = ? AND usuarios_id = ?",
      [articleId, requesterUserId],
    );
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

  let where = `WHERE a.estadoVenta = 'DISPONIBLE' AND a.estadoVenta <> 'BORRADO'`;
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

// mog 21062026 filtersHomeV3-> buscador desde /filters/search
const searchWithFilters = async (filters) => {

  // 🔥 CORRECCIÓN AQUÍ 🔥
  const texto = filters.text || filters.texto || '';
  const categoria = filters.categoria || '';
  const estado = filters.estado || '';
  const min = filters.min || '';
  const max = filters.max || '';
  const orden = filters.orden || '';

  let where = `WHERE a.estadoVenta = 'DISPONIBLE'`;
  const params = [];

  // Texto
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

  // Precio mínimo
  if (min) {
    where += ` AND a.precio >= ?`;
    params.push(min);
  }

  // Precio máximo
  if (max) {
    where += ` AND a.precio <= ?`;
    params.push(max);
  }

  // Ordenación
  let orderBy = `ORDER BY a.id DESC`;
  if (orden === "precio_asc") orderBy = `ORDER BY a.precio ASC`;
  if (orden === "precio_desc") orderBy = `ORDER BY a.precio DESC`;

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
  `;

  const [rows] = await pool.query(sql, params);
  return rows;
};

//**ARTICULOS VENDIDOS PARA ACTIVIDAD */
const selectSold = async (rango) => {
  const [result] = await pool.query(`
    SELECT 
      a.titulo,
      a.descripcion,
      a.created_at AS fecha,
      a.estadoVenta,
      u.nombre,
      u.apellidos
    FROM articulos a
    INNER JOIN usuarios u ON u.id = a.usuarios_id
    WHERE ${rango}
      AND a.estadoVenta = 'VENDIDO'
    ORDER BY a.created_at DESC
  `);
  return result;
};

// 1. Vendidos HOY
const selectDailySold = () => 
  selectSold(`DATE(a.created_at) = CURDATE()`);

// 2. Vendidos últimos 7 DÍAS
const selectWeeklySold = () => 
  selectSold(`a.created_at >= CURDATE() - INTERVAL 7 DAY`);

// 3. Vendidos MES ACTUAL
const selectMonthlySold = () => 
  selectSold(`MONTH(a.created_at) = MONTH(CURRENT_DATE())`);

//**ARTIUCLOS VENDIDOS PARA GRÁFICAS */
// Obtener articulos vendidos al mes 
const selectSoldThisMonth = async (month, year)=>{
    const [result]= await pool.query (`
       SELECT day(created_at) AS dia, COUNT(*) AS total
       FROM articulos
       WHERE estadoVenta = 'VENDIDO'
       AND month(created_at) = ? AND year(created_at) =?
       GROUP BY dia
       ORDER BY dia ASC`,
       [month, year]);
       return result
}
// Obtener articulos vendidos mensuales por año
const selectSoldByYear = async (year) =>{
    const [result]= await pool.query(`
       SELECT month(created_at) AS mes, COUNT(*) AS total
       FROM articulos
       WHERE estadoVenta = 'VENDIDO'
        AND year(created_at) =?
       GROUP BY mes
       ORDER BY mes ASC`,
       [year]);
       return result;
}
//**PUBLICADOS COMPARATIVA PARA METRIC */
//Obtener articulos publicados por mes
const selectByThisMonth = async ()=>{
    // seleccionar articulos publicados mes actual 
    const [result]= await pool.query (`
        SELECT COUNT(*) AS total
        FROM articulos
        WHERE month(created_at) = MONTH(CURRENT_DATE())
            AND year(created_at) = YEAR(CURRENT_DATE())
        `)
        return result[0];
}
// Articulos publicados el mes pasado
const selectByLastMonth = async ()=>{
    const now = new Date();
    const primerDia = new Date(now.getFullYear(), now.getMonth()-1,1);
    const ultimoDia= new Date (now.getFullYear(), now.getMonth(),0)

    const [result]= await pool.query (`
        SELECT COUNT(*) AS total
        FROM articulos
            WHERE created_at BETWEEN ? AND ?`,
        [primerDia,ultimoDia])
        return result[0];
}
//**ARTICULOS CREADOS */
//**Obtener actividad diaria de articulos */
const selectDaily = async ()=>{
  const [result] = await pool.query(`
    SELECT 
    a.titulo,
    a.descripcion,
    a.created_at AS fecha,
    u.nombre,
    u.apellidos
    FROM articulos a
    INNER JOIN usuarios u ON u.id = a.usuarios_id
    WHERE DATE(a.created_at) = CURDATE()
    ORDER BY a.created_at DESC
    `);
    return result
}
const selectWeekly = async ()=>{
  const [result] = await pool.query(`
    SELECT 
    a.titulo,
    a.descripcion,
    a.created_at AS fecha,
    u.nombre,
    u.apellidos
    FROM articulos a
    INNER JOIN usuarios u ON u.id = a.usuarios_id
    WHERE a.created_at >= CURDATE() -INTERVAL 7 DAY
    ORDER BY a.created_at DESC
    `);
    return result
}
const selectMonthly = async () =>{ 
  const [result] = await pool.query(`
  SELECT 
    a.titulo,
    a.descripcion,
    a.created_at AS fecha,
    u.nombre,
    u.apellidos
    FROM articulos a
    INNER JOIN usuarios u ON u.id = a.usuarios_id
    WHERE MONTH(a.created_at) = MONTH(CURRENT_DATE())
    ORDER BY a.created_at DESC
    `);
    return result
}


module.exports = {
  getAll,
  getUserArticles,
  getArticleEnums,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticle,
  getArticleFotos,
  searchArticles,
  searchWithFilters,
  selectSold,
  selectSoldThisMonth,
  selectSoldByYear,
  selectByThisMonth,
  selectByLastMonth,
  selectMonthly,
  selectMonthlySold,
  selectWeekly,
  selectWeeklySold,
  selectDaily,
  selectDailySold
};
