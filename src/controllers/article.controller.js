const {
  getAll,
  getArticle,
  getArticleFotos,
  getUserArticles,
  updateArticle,
  deleteArticle,
} = require("../models/article.model");
const UserModel = require("../models/users.model");

const getAllUserArticles = async (req, res) => {
  const userId = req.params.userId;

  try {
    const rawArticles = await getUserArticles(userId);

    return res.status(200).json({
      data: rawArticles,
    });
  } catch (error) {
    console.error("Error al obtener los artículos del usuario:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener los artículos del usuario",
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
        status: "success",
        message: "Artículo actualizado correctamente",
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Artículo no encontrado",
      });
    }
  } catch (error) {
    console.error("Error al actualizar el artículo:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar el artículo",
    });
  }
};

const eraseArticle = async (req, res) => {
  const articleId = req.params.articleId;
  const result = await deleteArticle(articleId);
  if (result) {
    return res.status(200).json({
      status: "success",
      message: "Artículo eliminado correctamente",
    });
  } else {
    return res.status(404).json({
      status: "error",
      message: "Artículo no encontrado",
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const responseArticle = await getArticle(id);
    if (responseArticle === undefined) {
      console.error("Artículo no encontrado");
      return res.status(404).json({
        status: "error",
        message: "Artículo no encontrado",
        data: responseArticle
      });
    }
    const responseFotos = await getArticleFotos(id);
    const responseArticleSeller = await UserModel.getById(id);

    const response = {
      ...responseArticle,
      fotos: responseFotos,
      seller: responseArticleSeller
    };
    return res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    console.error("Error al obtener el artículo:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener el artículo",
    });
  }
};

//mog 18062026 -> buscador de artículos//cargador de artículos desde la home
//mog 18062026 -> buscador de artículos / cargador de artículos desde la home
const ArticleModel = require("../models/article.model");

const searchArticles = async (req, res) => {
  console.log("🟢 Entrando en searchArticles con filtros:", req.query);
  debugger; // Agrega un punto de interrupción aquí para depuración
  try {
    const filters = {
      texto: req.query.texto || "",
      categoria: req.query.categoria || null,
      estado: req.query.estado || null,
      min: req.query.min || 0,
      max: req.query.max || 999999,
      ubicacion: req.query.ubicacion || "",
      orden: req.query.orden || "recientes",
      page: parseInt(req.query.page) || 1,
    };
    console.log("🟢 Llamando a ArticleModel.searchArticles");

    const result = await ArticleModel.searchArticles(filters);

    return res.status(200).json({
      status: "success",
      data: result,
    });

  } catch (error) {
    console.error("Error en searchArticles:", error);
    console.error("🔴 ERROR en searchArticles:", error);

    return res.status(500).json({
      status: "error",
      message: "Error interno en el servidor",
    });
  }
};


module.exports = {
  getAllUserArticles,
  editArticle,
  eraseArticle,
  searchArticles,
  getById,
};
