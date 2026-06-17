const  {
  getAll,
  getArticle,
  getArticleFotos,
  getUserArticles,
  updateArticle,
  deleteArticle,
  selectByThisMonth, 
  selectByLastMonth
} = require("../models/article.model");
const UserModel = require("../models/users.model");
const ArticleModel = require ('../models/article.model')

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

// Llamada al modelo soldThisMonth
const getSoldThisMonth = async (req, res)=>{
    try {
        const {month} = req.params;
        const year = new Date().getFullYear()
        if(!month){
            return res.status (400).json({
                message: 'month no recibido'
            })
        }
        const ventasMensuales = await ArticleModel.selectSoldThisMonth(month, year)
        res.json (ventasMensuales)
    } catch (error) {
        console.error("ERROR EN CONTROLLER:", error);
         console.error(error);
        res.status(500).json({ message: 'ERROR obteniendo ventas mes' }) 
        }
    }

// Llamada al modelo soldByyear
const getSoldByYear = async (req, res)=>{
    try {
        const {year}= req.params
        if(!year){
            return res.status (400).json ({
            message: 'parámetro year no recibido'
        })
     }
     const ventasAnuales = await ArticleModel.selectSoldByYear(year);
     res.json (ventasAnuales)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo fechas por año' });
    }
}


// LLamar al modelo selectbymonth para gestionar los articulos publicados el mes actual
const getThisMonth = async (req, res) =>{
    try {
        const data = await selectByThisMonth()
        res.json ({total: data.total})
    } catch (error) {
        console.error (error)
        return res.status (500).json({
            message: ' Error devolviendo articulos publicados al mes'
        })
    }
}

const getLastMonth = async (req,res) =>{
    try {
        const data = await selectByLastMonth();
        res.json ({total: data.total})
    } catch (error) {
        console.error (error)
        return res.status (500).json({
            message:'Error devolviendo articulos publicados el mes pasado'
        })
        
    }
}
module.exports = {
  getAllUserArticles,
  editArticle,
  eraseArticle,
  getById,
    getAllUserArticles,
    getThisMonth,
    getLastMonth,
    getSoldThisMonth,
    getSoldByYear
};
