const express = require('express');
const router = express.Router();

// Controlador de artículos
const articlesController = require('../../controllers/article.controller');

// Middleware de autenticación (FALTABA EN LOCAL)
const { checkAuthToken } = require('../../middlewares/auth.middleware');

// Middleware de subida de imágenes (FALTABA EN LOCAL)
const upload = require('../../middlewares/multer.middleware');

// Todas las rutas de este módulo requieren token
router.use(checkAuthToken);

// Crear artículo con imágenes
router.post('/:userId', upload.array('images', 5), articlesController.createArticleHandler);

// Crear artículo sin especificar userId en la URL
router.post('/', upload.array('images', 5), articlesController.createArticleHandler);

// Obtener artículo por ID
router.get('/article/:id', articlesController.getById);

// Obtener todos los artículos de un usuario
router.get('/:userId', articlesController.getAllUserArticles);

// Editar artículo (con nuevas imágenes opcionales)
router.put('/:articleId', upload.array('images', 5), articlesController.editArticle);

// Borrar artículo
router.delete('/:articleId', articlesController.eraseArticle);

module.exports = router;
