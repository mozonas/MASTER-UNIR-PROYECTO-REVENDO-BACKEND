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

            const rawCounters = {
                pendingArticlesCount: rawArticles,
                pendingChatsCount: rawChats
            };

            const validatedCounters = badgeCountersSchema.cast(rawCounters);

            res.json(validatedCounters);
        } catch (error) {
            console.error('Error al obtener los contadores de badges:', error);
            res.status(500).json({ error: 'Error al obtener los contadores de badges' });
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
    }


};

module.exports = ReportsController;

