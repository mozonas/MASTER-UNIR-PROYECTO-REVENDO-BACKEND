const pool = require('../config/db');

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
        console.error('Error al obtener los artículos GetAll:', error);
        throw error;
    }   };

getUserArticles = async (userId) => {
    try {
        const [rows] = await pool.query('SELECT * FROM articulos WHERE usuarios_id = ?', [userId]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los artículos del usuario:', error);
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

deleteArticle = async (articleId) => {
    try {
        const [result] = await pool.query('DELETE FROM articulos WHERE id = ?', [articleId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar el artículo:', error);
        throw error;
    }
};

module.exports = {
    getAll,
    getUserArticles,
    updateArticle,
    deleteArticle
};