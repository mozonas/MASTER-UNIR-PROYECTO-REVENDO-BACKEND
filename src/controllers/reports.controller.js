const Report = require('../models/reports.model');
const { badgeCountersSchema } = require('../schemas/reports.schema');

const ReportsController = {
    getBadgesCounters: async (req, res) => {
        try {
            const rawArticles = await Report.countPendingArticles();
            const rawChats = await Report.countPendingChats();

            const validatedCounters = badgeCountersSchema.cast({
                pendingArticlesCount: rawArticles,
                pendingChatsCount: rawChats
            });

            res.json(validatedCounters);
        } catch (error) {
            console.error('Error al obtener los contadores de badges:', error);
            res.status(500).json({ error: 'Error al obtener los contadores de badges' });
        }
    },

    reportArticle: async (req, res) => {
        try {
            const articuloId = parseInt(req.params.articleId);
            const { motivo, usuarioId } = req.body;

            if (!motivo || !usuarioId) {
                return res.status(400).json({ error: 'Motivo y usuarioId son requeridos' });
            }

            const reporteId = await Report.createReport(articuloId, motivo, usuarioId);
            res.status(201).json({ message: 'Artículo reportado y puesto en revisión', reporteId });
        } catch (error) {
            console.error('Error al reportar el artículo:', error);
            res.status(500).json({ error: 'Error al reportar el artículo' });
        }
    },

    getArticlesInReview: async (req, res) => {
        try {
            const articles = await Report.getArticlesInReview();
            res.json(articles);
        } catch (error) {
            console.error('Error al obtener artículos en revisión:', error);
            res.status(500).json({ error: 'Error al obtener artículos en revisión' });
        }
    },

    resolveReport: async (req, res) => {
        try {
            const reporteId = parseInt(req.params.reporteId);
            const { accion } = req.body;

            if (!['aprobar', 'descartar'].includes(accion)) {
                return res.status(400).json({ error: 'Acción debe ser "aprobar" o "descartar"' });
            }

            await Report.resolveReport(reporteId, accion);
            res.json({ message: `Reporte ${accion === 'aprobar' ? 'aprobado: artículo retirado' : 'descartado: artículo restaurado'}` });
        } catch (error) {
            console.error('Error al resolver el reporte:', error);
            res.status(500).json({ error: 'Error al resolver el reporte' });
        }
    }
};

module.exports = ReportsController;

