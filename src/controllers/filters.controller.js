const { searchWithFilters } = require('../models/article.model');

const search = async (req, res) => {
    try {
        const filters = req.query;

        const results = await searchWithFilters(filters);
        console.log('REQ QUERY -->', req.query);
        return res.json({
            status: 'ok',
            data: results
        });

    } catch (error) {
        console.error('Error en filtros:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al buscar artículos con filtros'
        });
    }
};

module.exports = {
    search
};
