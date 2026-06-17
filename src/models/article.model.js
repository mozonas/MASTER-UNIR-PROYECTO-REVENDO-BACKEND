const pool = require('../config/db');
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

module.exports = {
    getAll,
    getUserArticles,
    selectSoldThisMonth,
    selectSoldByYear,
    selectByThisMonth,
    selectByLastMonth
};