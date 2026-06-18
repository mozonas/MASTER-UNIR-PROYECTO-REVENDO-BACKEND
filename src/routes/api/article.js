/* 1. Importar el modulo Router de express
2. Importar las funciones del controlador de articulos
3. Importar la funcion intermedia de validacion de articulos
4. Crear una instancia del Router
5. Definir las rutas para cada operacion (GET, POST, PUT, DELETE)
6. Exportar el router para ser utilizado en el servidor
*/

// 1. Importar el modulo Router de express
const express = require("express");

// 2. Importar las funciones del controlador de articulos
const {
  getAllUserArticles,
  getById,
  getEnums,
} = require("../../controllers/article.controller");

// 4. Crear una instancia del Router
const router = express.Router();
console.log("Router de articulos creado.");

// 5. Definir las rutas para cada operacion (GET, POST, PUT, DELETE)
router.get("/enums", getEnums);       // GET /api/article/enums
router.get("/", getAllUserArticles);  // GET /api/article
router.get("/:id", getById);          // GET /api/article/:id

// 6. Exportar el router para ser utilizado en el servidor
module.exports = router;
