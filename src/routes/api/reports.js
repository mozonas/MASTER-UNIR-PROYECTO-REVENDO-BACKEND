const express = require('express');
const router = express.Router();

// Ubicar el controlador de reportes
const reportsController = require('../../controllers/reports.controller');

// Ruta para obtener los contadores de badges en el panel de moderación
router.get ('/badges-counters', reportsController.getBadgesCounters);

// Rutas para el módulo de articulos
router.get('/articles/pending', reportsController.getPendingArticles);
router.get('/articles/history', reportsController.getArticlesHistory);

// Rutas para el módulo de mensajeria
router.get('/chats/pending', reportsController.getPendingChats);
router.get('/chats/history', reportsController.getChatsHistory);

// Exportar el router para usarlo en el archivo principal de rutas
module.exports = router;
