/* 1. Importar el modulo Router de express
2. Importar las funciones del controlador de articulos
3. Importar la funcion intermedia de validacion de articulos
4. Crear una instancia del Router
5. Definir las rutas para cada operacion (GET, POST, PUT, DELETE)
6. Exportar el router para ser utilizado en el servidor
*/

const express = require("express");

const {
  getAllArticles,
  getById,
  getEnums,
  searchArticles
} = require("../../controllers/article.controller");

const router = express.Router();
console.log("Router de articulos creado.");

// 👉 SIEMPRE PRIMERO
router.get("/enums", getEnums);
router.get("/search", searchArticles);

// 👉 LUEGO LAS RUTAS NORMALES
router.get("/", getAllArticles);

// 👉 SIEMPRE AL FINAL
router.get("/:id", getById);

module.exports = router;
