/* 1. Importar el modulo Router de express
2. Importar las funciones del controlador de articulos
3. Importar la funcion intermedia de validacion de articulos
4. Crear una instancia del Router
5. Definir las rutas para cada operacion (GET, POST, PUT, DELETE)
6. Exportar el router para ser utilizado en el servidor
*/


// 1. Importar el modulo Router de express
const express = require('express')

// 2. Importar las funciones del controlador de articulos
const articleController = require('../../controllers/article.controller');



// 4. Crear una instancia del Router
const router = express.Router();
console.log('Router de articulos creado.');

// 5. Definir las rutas para cada operacion (GET, POST, PUT, DELETE)
//router.get('/', articleController.getAll); // GET /api/articles


// Ruta para extraer articulos publicados este mes y el anterior
router.get ('/published/this-month', articleController.getThisMonth);
router.get ('/published/last-month', articleController.getLastMonth);

// Ruta para extraer articulos vendidos este mes
router.get ('/sold/:month', articleController.getSoldThisMonth);
// Ruta para extraer articulos vendidos este año
router.get ('/sold/year/:year', articleController.getSoldByYear);

// 6. Exportar el router para ser utilizado en el servidor
module.exports = router;

