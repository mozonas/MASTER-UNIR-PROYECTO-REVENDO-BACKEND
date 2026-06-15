const { getUserArticles } = require('../models/article.model');
const { updateArticle } = require('../models/article.model');
const { deleteArticle } = require('../models/article.model');

const getAllUserArticles = async (req, res) => {
    const userId = req.params.userId;

    try {
        const rawArticles = await getUserArticles(userId);

        return res.status(200).json({
            data: rawArticles
        });
    } catch (error) {
        console.error('Error al obtener los artículos del usuario:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener los artículos del usuario'
        });
    }
};

const editArticle = async (req, res) => {
    try {       
    const articleId = req.params.articleId;
    const updatedData = req.body;
    const result = await updateArticle(articleId, updatedData);
    if (result) {
        return res.status(200).json({
            status: 'success',
            message: 'Artículo actualizado correctamente'
        });
    } else {
        return res.status(404).json({
            status: 'error',
            message: 'Artículo no encontrado'
        });
    }
    } catch (error) {
        console.error('Error al actualizar el artículo:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el artículo'
        });
    }
};

const eraseArticle = async (req, res) => {
    const articleId = req.params.articleId;
    const result = await deleteArticle(articleId);
    if (result) {
        return res.status(200).json({
            status: 'success',
            message: 'Artículo eliminado correctamente'
        });
    } else {
        return res.status(404).json({
            status: 'error',
            message: 'Artículo no encontrado'
        });
    }
};

module.exports = {
    getAllUserArticles,
    editArticle,
    eraseArticle
};