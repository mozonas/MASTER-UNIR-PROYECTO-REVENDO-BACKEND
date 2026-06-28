const {
  getAll,
  getArticle,
  getArticleFotos,
  getArticleEnums,
  getUserArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../models/article.model");

const UserModel = require("../models/users.model");
const CategoryModel = require("../models/categories.model");

const getAllUserArticles = async (req, res) => {
  const userId = req.params.userId;

  try {
    const rawArticles = await getUserArticles(userId);

    return res.status(200).json({
      status: "success",
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

const getAllArticles = async (req, res) => {
  try {
    const rawArticles = await getAll();

    return res.status(200).json({
      status: "success",
      data: rawArticles,
    });
  } catch (error) {
    console.error("Error al obtener los artículos:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener los artículos",
    });
  }
};

const getEnums = async (req, res) => {
  try {
    const categories = await CategoryModel.getAll();
    const articleEnums = await getArticleEnums();

    return res.status(200).json({
      status: "success",
      data: {
        categorias: categories,
        estadoVenta: articleEnums.estadoVenta,
        estadoProducto: articleEnums.estadoProducto,
        tipoEntrega: articleEnums.tipoEntrega,
        tipoPago: articleEnums.tipoPago,
      },
    });
  } catch (error) {
    console.error("Error al obtener enums del artículo:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener enums del artículo",
    });
  }
};

const createArticleHandler = async (req, res) => {
  try {
    const userId = Number(req.user?.userId);

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Token inválido o sin usuario",
      });
    }

    const uploadedImages = Array.isArray(req.files)
      ? req.files
          .filter((file) => file && typeof file.filename === 'string')
          .map((file) => `uploads/${file.filename}`)
      : [];

    const firstImage = uploadedImages[0]
      ?? (Array.isArray(req.body.images)
        ? (req.body.images[0] ?? "")
        : (req.body.image1 ?? req.body.image ?? ""));

    if (!String(firstImage).trim()) {
      return res.status(400).json({
        status: "error",
        message: "La primera imagen es obligatoria",
      });
    }

    const payload = {
      ...req.body,
      images: uploadedImages.length ? uploadedImages : req.body.images,
      usuarios_id: userId,
    };
    const newArticleId = await createArticle(payload);
    return res.status(201).json({
      status: "success",
      message: "Artículo creado correctamente",
      data: { id: newArticleId },
    });
  } catch (error) {
    console.error("Error al crear el artículo:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: "error",
      message: statusCode === 500 ? "Error al crear el artículo" : error.message,
    });
  }
};

const editArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const uploadedImages = Array.isArray(req.files)
      ? req.files
          .filter((file) => file && typeof file.filename === 'string')
          .map((file) => `uploads/${file.filename}`)
      : [];
    const updatedData = {
      ...req.body,
      images: uploadedImages.length ? uploadedImages : req.body.images,
    };
    const requesterUserId = Number(req.user?.userId);
    const requesterRole = String(req.user?.perfil || '').toUpperCase();
    const canEditAny = requesterRole === 'MODERADOR';

    if (!requesterUserId) {
      return res.status(401).json({
        status: "error",
        message: "Token inválido o sin usuario",
      });
    }

    const result = await updateArticle(articleId, requesterUserId, updatedData, canEditAny);
    if (result) {
      return res.status(200).json({
        status: "success",
        message: "Artículo actualizado correctamente",
      });
    } else {
      return res.status(403).json({
        status: "error",
        message: "No autorizado para modificar este artículo",
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
  try {
    const articleId = req.params.articleId;
    const requesterUserId = Number(req.user?.userId);
    const requesterRole = String(req.user?.perfil || '').toUpperCase();
    const canDeleteAny = requesterRole === 'MODERADOR' || requesterRole === 'ADMIN';

    if (!requesterUserId) {
      return res.status(401).json({
        status: "error",
        message: "Token inválido o sin usuario",
      });
    }

    const result = await deleteArticle(articleId, requesterUserId, canDeleteAny);
    if (result) {
      return res.status(200).json({
        status: "success",
        message: "Artículo eliminado correctamente",
      });
    } else {
      return res.status(403).json({
        status: "error",
        message: "No autorizado para eliminar este artículo",
      });
    }
  } catch (error) {
    console.error("Error al eliminar el artículo:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar el artículo",
    });
  }
};

const getById = async (req, res) => {
  try {
    const requesterUserId = Number(req.user?.userId);
    const requesterRole = String(req.user?.perfil || '').toUpperCase();
    const canEditAny = requesterRole === 'MODERADOR';
   /*  if (!requesterUserId) {
      return res.status(401).json({
        status: "error",
        message: "Token inválido o sin usuario",
      });
    } */

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

    /* if (!canEditAny && Number(responseArticle.usuarios_id) !== requesterUserId) {
      return res.status(403).json({
        status: "error",
        message: "No autorizado para editar este artículo",
      });
    } */

    const responseFotos = await getArticleFotos(id);
    const responseArticleSeller = responseArticle?.usuarios_id
      ? await UserModel.getById(responseArticle.usuarios_id)
      : null;

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


//**PARA DASHBOARD */
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
        const data = await ArticleModel.selectByThisMonth()
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
        const data = await ArticleModel.selectByLastMonth();
        res.json ({total: data.total})
    } catch (error) {
        console.error (error)
        return res.status (500).json({
            message:'Error devolviendo articulos publicados el mes pasado'
        })
        
    }
}

//Controlador unificado para la Metric Card de publicaciones
const getPublishedComp = async (req,res)=>{
  try{
    const [thisMonthData, lastMonthData] = await Promise.all([
      ArticleModel.selectByThisMonth(),
      ArticleModel.selectByLastMonth()
    ]);
    const thisMonth = thisMonthData?.total || 0;
    const lastMonth = lastMonthData?.total || 0;
    const difference = thisMonth -lastMonth;
    return res.json ({thisMonth, lastMonth, difference});
  }catch (error){
    console.error('Error en getPublishedComparison:', error);
        return res.status(500).json({ 
            message: 'Error interno del servidor al calcular la comparativa.' 
        });
  }
}


module.exports = {
  getAllUserArticles,
  getAllArticles,
  getEnums,
  createArticleHandler,
  editArticle,
  eraseArticle,
  searchArticles,
  getById,
  getAllUserArticles,
  getThisMonth,
  getLastMonth,
  getSoldThisMonth,
  getSoldByYear, 
  getPublishedComp
};
