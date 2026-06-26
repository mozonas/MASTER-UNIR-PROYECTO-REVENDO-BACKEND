/* 1. Importar el modulo Router de express
2. Importar las funciones del controlador de articulos
3. Importar la funcion intermedia de validacion de articulos
4. Crear una instancia del Router
5. Definir las rutas para cada operacion (GET, POST, PUT, DELETE)
6. Exportar el router para ser utilizado en el servidor
*/

const express = require("express");

/* const {
  getAllArticles,
  getById,
  getEnums,
  searchArticles
} = require("../../controllers/article.controller"); */

const articleController = require('../../controllers/article.controller');
const router = express.Router();
console.log("Router de articulos creado.");

// 👉 SIEMPRE PRIMERO
router.get("/enums", articleController.getEnums);
router.get("/search", articleController.searchArticles);

// 👉 LUEGO LAS RUTAS NORMALES
router.get("/", articleController.getAllArticles);




//MG RUTAS AÑADIDAS PARA LAS GRÁFICAS DEL DASHBOARD
// Ruta para extraer comparación de articulos publicados este mes con el anterior
router.get ('/published/comparison', articleController.getPublishedComp);
// Ruta para extraer articulos vendidos este mes
router.get ('/sold/:month', articleController.getSoldThisMonth);
// Ruta para extraer articulos vendidos este año
router.get ('/sold/year/:year', articleController.getSoldByYear)
 
// 👉 SIEMPRE AL FINAL
router.get("/:id", articleController.getById);


module.exports = router;

