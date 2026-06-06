const express = require('express');
const router = express.Router();

// Ubicar el controlador de moderación
const moderationController = require('../../controllers/moderation.controller');

// Ruta para obtener los contadores de badges en el panel de moderación
router.get ('/badges-counters', moderationController.getBadgesCounters);

// Exportar el router para usarlo en el archivo principal de rutas
module.exports = router;
