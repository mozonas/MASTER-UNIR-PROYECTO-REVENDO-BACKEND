const express = require('express');
const router = express.Router();

// Ubicar el controlador de reportes
const reportsController = require('../../controllers/reports.controller');

// Ruta para obtener los contadores de badges en el panel de moderación
router.get ('/badges-counters', reportsController.getBadgesCounters);

// Exportar el router para usarlo en el archivo principal de rutas
module.exports = router;
