const { getUserArticles, createArticle, updateArticle, deleteArticle, getArticle, getArticleEnums } = require('../models/article.model');
const categoryModel = require('../models/categories.model');

const resolveCategoryId = async (rawCategory) => {
    if (typeof rawCategory === 'number' || (typeof rawCategory === 'string' && /^\d+$/.test(rawCategory.trim()))) {
        return Number(rawCategory);
    }

    if (typeof rawCategory === 'string' && rawCategory.trim()) {
        const category = await categoryModel.getByName(rawCategory.trim());
        return category ? Number(category.id) : null;
    }

    return null;
};

const validateEnumValue = (value, allowedValues, fieldLabel) => {
    if (value == null || value === '') {
        return null;
    }

    if (!Array.isArray(allowedValues) || allowedValues.length === 0) {
        return `${fieldLabel}: no hay valores ENUM configurados en base de datos`;
    }

    if (!allowedValues.includes(value)) {
        return `${fieldLabel} inválido. Valores permitidos: ${allowedValues.join(', ')}`;
    }

    return null;
};

const getAllUserArticles = async (req, res) => {
    const userId = req.params.userId;
    const { estado } = req.query;

    try {
        const rawArticles = await getUserArticles(userId, estado);

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

const addArticle = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const rawCategory = req.body?.categorias_id;
        const categoriasId = await resolveCategoryId(rawCategory);

        if (!categoriasId) {
            return res.status(400).json({
                status: 'error',
                message: 'Debe indicar una categoría válida'
            });
        }

        const enums = await getArticleEnums();
        const enumErrors = [
            validateEnumValue(req.body?.tipoEntrega, enums.tipoEntrega, 'tipoEntrega'),
            validateEnumValue(req.body?.tipoPago, enums.tipoPago, 'tipoPago'),
            validateEnumValue(req.body?.estadoProducto, enums.estadoProducto, 'estadoProducto')
        ].filter(Boolean);

        if (enumErrors.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: enumErrors.join(' | ')
            });
        }

        const articleData = {
            titulo: req.body?.titulo,
            descripcion: req.body?.descripcion,
            precio: req.body?.precio,
            estadoProducto: req.body?.estadoProducto || null,
            tipoEntrega: req.body?.tipoEntrega,
            tipoPago: req.body?.tipoPago,
            categorias_id: categoriasId,
            usuarios_id: userId,
            estadoVenta: req.body?.estadoVenta || 'DISPONIBLE'
        };

        const newId = await createArticle(articleData);

        return res.status(201).json({
            status: 'success',
            message: 'Artículo creado correctamente',
            data: { id: newId }
        });
    } catch (error) {
        console.error('Error al crear el artículo:', error);
        return res.status(500).json({
            status: 'error',
            message: error?.sqlMessage || 'Error al crear el artículo'
        });
    }
};

const editArticle = async (req, res) => {
    try {       
    const articleId = req.params.articleId;
    const updatedData = { ...req.body };

    if (Object.prototype.hasOwnProperty.call(updatedData, 'categorias_id')) {
        const mappedCategoryId = await resolveCategoryId(updatedData.categorias_id);
        if (!mappedCategoryId) {
            return res.status(400).json({
                status: 'error',
                message: 'Debe indicar una categoría válida'
            });
        }
        updatedData.categorias_id = mappedCategoryId;
    }

    const enums = await getArticleEnums();
    const enumErrors = [
        Object.prototype.hasOwnProperty.call(updatedData, 'tipoEntrega')
            ? validateEnumValue(updatedData.tipoEntrega, enums.tipoEntrega, 'tipoEntrega')
            : null,
        Object.prototype.hasOwnProperty.call(updatedData, 'tipoPago')
            ? validateEnumValue(updatedData.tipoPago, enums.tipoPago, 'tipoPago')
            : null,
        Object.prototype.hasOwnProperty.call(updatedData, 'estadoProducto')
            ? validateEnumValue(updatedData.estadoProducto, enums.estadoProducto, 'estadoProducto')
            : null,
    ].filter(Boolean);

    if (enumErrors.length > 0) {
        return res.status(400).json({
            status: 'error',
            message: enumErrors.join(' | ')
        });
    }

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
            message: error?.sqlMessage || 'Error al actualizar el artículo'
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

const getById = async (req, res) => {
     try {
        const { id } = req.params;
        const rawArticle = await getArticle(id);

        return res.status(200).json({
            status: 'success',
            data: rawArticle
        });
    } catch (error) {
        console.error('Error al obtener el artículo:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener el artículo'
        });
    } 
};

const getEnums = async (req, res) => {
  try {
    const enums = await getArticleEnums();
    return res.status(200).json({ status: 'success', data: enums });
  } catch (error) {
    console.error('Error al obtener ENUMs:', error);
    return res.status(500).json({ status: 'error', message: 'Error al obtener los valores ENUM' });
  }
};

module.exports = {
    getAllUserArticles,
    addArticle,
    editArticle,
    eraseArticle,
    getById,
    getEnums
};