const Article = require('../models/article.model');

exports.getUserArticles = async (req, res) => {    
    
    console.log('Controlador: Obteniendo artículos de un usuario específico...');

    try {
        const { userId } = req.params;

        // Buscamos artículos del usuario y agrupamos o filtramos

        const items = await Article.find({ usuarios_id: userId });
    
         // Clasificamos en el backend para facilitar el trabajo al front
         const response = {
            enVenta: items.filter(i => i.status === 'DISPONIBLE'),
            vendidos: items.filter(i => i.status === 'VENDIDO'),
            reservados: items.filter(i => i.status === 'RESERVADO'),
    };
    
    res.status(200).json(response);

    } catch (error) {
        console.error('Controlador: Error al obtener los articulos:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los articulos'
        });
    }
};