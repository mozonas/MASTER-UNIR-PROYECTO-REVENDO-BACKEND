const express = require('express');
const router = express.Router();

const reportsController = require('../../controllers/reports.controller');

router.get('/badges-counters', reportsController.getBadgesCounters);
router.post('/report-article/:articleId', reportsController.reportArticle);
router.get('/articles-in-review', reportsController.getArticlesInReview);
router.put('/resolve/:reporteId', reportsController.resolveReport);

// Rutas para el módulo de articulos
router.get('/articles/pending', reportsController.getPendingArticles);
router.get('/articles/history', reportsController.getArticlesHistory);

// Rutas para el módulo de mensajeria
router.get('/chats/pending', reportsController.getPendingChats);
router.get('/chats/history', reportsController.getChatsHistory);

// Ruta para obtener el tipo de reporte
router.get('/types', reportsController.getReportTypes);

// Exportar el router para usarlo en el archivo principal de rutas
module.exports = router;
