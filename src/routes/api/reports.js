const express = require('express');
const router = express.Router();

const reportsController = require('../../controllers/reports.controller');
const { checkAuthToken } = require('../../middlewares/auth.middleware');

router.get('/badges-counters', reportsController.getBadgesCounters);
router.post('/report-article/:articleId', reportsController.reportArticle);
router.get('/articles-in-review', reportsController.getArticlesInReview);
router.put('/resolve/:reporteId', checkAuthToken, reportsController.resolveReport);

// Rutas para el módulo de articulos
router.get('/articles/pending', reportsController.getPendingArticles);
router.get('/articles/history', reportsController.getArticlesHistory);

// Rutas para el módulo de mensajeria
router.get('/chats/pending', reportsController.getPendingChats);
router.get('/chats/history', reportsController.getChatsHistory);

// Ruta para obtener el tipo de reporte
router.get('/types/:categoria', reportsController.getReportTypes);

// Enviar notificación al usuario afectado por la incidencia
router.post('/chats/notificar/:reporteId', checkAuthToken, reportsController.enviarNotificacionChat);

// Ruta para reportar un usuario en el chat
router.post('/chats/reportar-usuario', reportsController.reportarUsuarioChat);

// Ruta para resolver un reporte de chat
router.put('/chats/resolve/:reporteId', reportsController.resolveReportChat);


// Exportar el router para usarlo en el archivo principal de rutas
module.exports = router;