const userModel = require('../models/users.model');
const categoryModel = require('../models/categories.model');


const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const total = await userModel.countAll();
    const users = await userModel.getAllPaginated(limit, offset);

    return res.json({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await userModel.deleteUser(id);

    return res.json({ message: 'Usuario eliminado correctamente' });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Bloquear / desbloquear usuario
const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    await userModel.toggleBlock(id, isBlocked);

    return res.json({ message: 'Estado actualizado', isBlocked });

  } catch (error) {
    console.error('Error actualizando estado de bloqueo:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ===============================
//   BUSCAR POR ID (único)
// ===============================
const searchById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.getById(id);

    return res.json({ user: user || null });

  } catch (error) {
    console.error('Error buscando usuario por ID:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


// ===============================
//   BUSCAR POR USERNAME (único)
// ===============================
const searchByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await userModel.getByUsername(username);

    return res.json({ user: user || null });

  } catch (error) {
    console.error('Error buscando usuario por username:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


// ===============================
//   BUSCAR POR EMAIL (único)
// ===============================
const searchByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await userModel.getByEmail(email);

    return res.json({ user: user || null });

  } catch (error) {
    console.error('Error buscando usuario por email:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ===============================
//   GET categorías (paginado)
// ===============================
const getCategoriesPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const categories = await categoryModel.getAllPaginated(limit, offset);
    const total = await categoryModel.countAll();

    return res.json({
      categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error obteniendo categorías paginadas:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ===============================
//   POST crear categoría
// ===============================
const createCategory = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    await categoryModel.insert(nombre.trim());

    return res.json({ message: 'Categoría creada correctamente' });

  } catch (error) {
    console.error('Error creando categoría:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ===============================
//   PUT actualizar categoría
// ===============================
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    await categoryModel.update(id, nombre.trim());

    return res.json({ message: 'Categoría actualizada correctamente' });

  } catch (error) {
    console.error('Error actualizando categoría:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ===============================
//   DELETE eliminar categoría
// ===============================
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await categoryModel.remove(id);

    return res.json({ message: 'Categoría eliminada correctamente' });

  } catch (error) {
    console.error('Error eliminando categoría:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


module.exports = {
  getAllUsers,
  deleteUser,
  toggleBlockUser,
  searchById,
  searchByUsername,
  searchByEmail,
  getCategoriesPaginated,
  createCategory,
  updateCategory,
  deleteCategory
};
