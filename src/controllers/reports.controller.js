const Report = require('../models/reports.model');
const {
    badgeCountersSchema,
    pendingArticlesArraySchema,
    articlesHistoryArraySchema,
    pendingChatsArraySchema,
    chatsHistoryArraySchema
} = require('../schemas/reports.schema');

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
            const { motivo, reportType, usuarioId } = req.body;

            if (!motivo || !usuarioId) {
                return res.status(400).json({ error: 'Motivo y usuarioId son requeridos' });
            }

            const reporteId = await Report.createReport(articuloId, motivo, reportType, usuarioId);
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
            const moderadorId = Number(req.user?.userId);

            if (!['aprobar', 'descartar'].includes(accion)) {
                return res.status(400).json({ error: 'Acción debe ser "aprobar" o "descartar"' });
            }

            if (!moderadorId) {
                return res.status(401).json({ error: 'Token inválido o sin usuario' });
            }

            await Report.resolveReport(reporteId, accion, moderadorId);
            res.json({ message: `Reporte ${accion === 'aprobar' ? 'aprobado: artículo retirado' : 'descartado: artículo restaurado'}` });
        } catch (error) {
            console.error('Error al resolver el reporte:', error);
            res.status(500).json({ error: 'Error al resolver el reporte' });
        }
    },

    getPendingArticles: async (req, res) => {
        try {
            const rawArticles = await Report.getPendingArticles();

            const validatedArticles = pendingArticlesArraySchema.cast(rawArticles);

            res.json(validatedArticles);
        } catch (error) {
            console.error('Error en controlador al obtener artículos pendientes:', error);
            res.status(500).json({ error: 'Error al obtener los artículos pendientes' });
        }
    },

    getArticlesHistory: async (req, res) => {
        try {
            const rawHistory = await Report.getArticlesHistory();
            const validatedHistory = articlesHistoryArraySchema.cast(rawHistory);
            res.json(validatedHistory);
        } catch (error) {
            console.error('Error en controlador al obtener historial de artículos:', error);
            res.status(500).json({ error: 'Error al obtener el historial de artículos' });
        }
    },

    getPendingChats: async (req, res) => {
        try {
            const rawChats = await Report.getPendingChats();
            const validatedChats = pendingChatsArraySchema.cast(rawChats);
            res.json(validatedChats);
        } catch (error) {
            console.error('Error en controlador al obtener chats pendientes:', error);
            res.status(500).json({ error: 'Error al obtener los chats pendientes' });
        }
    },

    getChatsHistory: async (req, res) => {
        try {
            const rawHistory = await Report.getChatsHistory();
            const validatedHistory = chatsHistoryArraySchema.cast(rawHistory);
            res.json(validatedHistory);
        } catch (error) {
            console.error('Error en controlador al obtener historial de chats:', error);
            res.status(500).json({ error: 'Error al obtener el historial de chats' });
        }
    },

    /**
     * Función para obtener los tipos de reporte de artículos
     * @param {*} req 
     * @param {*} res 
     */
    getReportTypes: async (req, res) => {
        try {
            console.log(req.params.categoria);
            const categoria = req.params.categoria;
            
            const rawTypes = await Report.getReportTypes(categoria);
            res.json(rawTypes);
        } catch (error) {
            console.error('Error en controlador al obtener los tipos de reporte:', error);
            res.status(500).json({ error: 'Error al obtener los tipos de reporte' });
        }
    },

    enviarNotificacionChat: async (req, res) => {
        try {
            const reporteId = parseInt(req.params.reporteId);
            const { contenido, articulos_id } = req.body;
            const moderadorId = Number(req.user?.userId);

            if (!contenido || !articulos_id) {
                return res.status(400).json({ error: 'contenido y articulos_id son requeridos' });
            }

            if (!moderadorId) {
                return res.status(401).json({ error: 'Token inválido o sin usuario' });
            }

            const NuevoMensaje = {
                titulo: 'Notificación de Incidencia',
                contenido,
                fecha: new Date(),
                usuarios_id: moderadorId,
                articulos_id
            };

            const MessageModel = require('../models/messages.model');
            await MessageModel.insert(NuevoMensaje);

            res.status(201).json({ message: 'Notificación enviada correctamente' });
        } catch (error) {
            console.error('Error al enviar notificación:', error);
            res.status(500).json({ error: 'Error al enviar la notificación' });
        }
    },

    reportarUsuarioChat: async (req, res) => {
        try {
            const { motivo, usuarios_id, articulos_id } = req.body;

            if (!motivo || !usuarios_id || !articulos_id) {
                return res.status(400).json({ error: 'motivo, usuarios_id y articulos_id son requeridos' });
            }

            const reporteId = await Report.createReportUsuario(motivo, usuarios_id, articulos_id);
            res.status(201).json({ message: 'Usuario reportado correctamente', reporteId });
        } catch (error) {
            console.error('Error al reportar usuario:', error);
            res.status(500).json({ error: 'Error al reportar el usuario' });
        }
    },

    resolveReportChat: async (req, res) => {
        try {
            const reporteId = parseInt(req.params.reporteId);
            const { accion } = req.body;

            if (!['archivar', 'bloquear'].includes(accion)) {
                return res.status(400).json({ error: 'Acción debe ser "archivar" o "bloquear"' });
            }

            await Report.resolveReportChat(reporteId, accion);
            res.json({ message: `Incidencia ${accion === 'archivar' ? 'archivada' : 'bloqueada'} correctamente` });
        } catch (error) {
            console.error('Error al resolver la incidencia de chat:', error);
            res.status(500).json({ error: 'Error al resolver la incidencia' });
        }
    }

};

module.exports = ReportsController;