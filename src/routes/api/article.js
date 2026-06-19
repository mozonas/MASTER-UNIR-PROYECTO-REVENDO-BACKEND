/* 1. Importar el modulo Router de express
2. Importar las funciones del controlador de articulos
3. Importar la funcion intermedia de validacion de articulos
4. Crear una instancia del Router
5. Definir las rutas para cada operacion (GET, POST, PUT, DELETE)
6. Exportar el router para ser utilizado en el servidor
*/

const express = require("express");

const {
  getAllUserArticles,
  getById,
  getEnums,
  searchArticles
} = require("../../controllers/article.controller");

const router = express.Router();
console.log("Router de articulos creado.");

// 5. Definir las rutas para cada operacion (GET, POST, PUT, DELETE)
router.get("/enums", getEnums);       // GET /api/article/enums
router.get("/", getAllUserArticles);  // GET /api/article
router.get("/:id", getById);          // GET /api/article/:id
router.get("/search", searchArticles);

module.exports = router;
