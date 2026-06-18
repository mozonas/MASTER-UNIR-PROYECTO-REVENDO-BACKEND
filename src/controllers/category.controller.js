const { getAllCategories } = require("../models/categories.model");

const getAll = async (req, res) => {
  try {
    const categorias = await getAllCategories();

    return res.status(200).json({
      status: "success",
      data: categorias
    });

  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener categorías"
    });
  }
};

module.exports = {
  getAll,
};
