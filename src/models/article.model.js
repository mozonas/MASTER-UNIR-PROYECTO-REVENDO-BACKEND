/* 
1. Importar conexion a la base de datos
2. Obtner los articulos
3. Crear nuevo articulo
4. Eliminar articulo
5. Actualizar articulo
6. Exportar el modelo

*/


// 1.Importar conexion a la base de datos
const db = require('../confing/db');

// 2. Obtener los articulos
const Article = {
findAll: async () => {
    console.log('Obteniendo articulos...');
    const sql = 'SELECT * FROM articles'; // Confirmar que la tabla se llama articles
    const [rows] = await db.query(sql);
    console.log('Articulos obtenidos:', rows);
    return rows;
    }
};

// 6. Exportar el modelo
module.exports = Article;
