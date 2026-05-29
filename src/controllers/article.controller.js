/*
1. Importar el modelo de articulo
2. Funcion para listar todos los articulos
3. Funcion para buscar un articulo especifico por su id
4. Funcion para guardar el nuevo articulo en la base de datos
5. Funcion para modificar un articulo existente
6. Funcion para eliminar un articulo por su id
7. Exportar las funciones para ser utilizadas en las rutas
*/

// 1. Importar el modelo de articulo
const Article = require('../models/article.model');

// 2. Funcion para listar todos los articulos
exports.getAll = async (req, res) => {
    console.log('Controlador: Obteniendo todos los articulos...');
    try {
        const articles = await Article.findAll();
        console.log('Controlador: Articulos obtenidos:', articles);
        res.status (200).json({
            status: 'success',
            data: articles  
        });
    } catch (error) {
        console.error('Controlador: Error al obtener los articulos:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los articulos'
        });
    }
};
