const express = require('express');
const router = express.Router();

const categoryController = require('../../controllers/category.controller');
// const validateCategory = require('../middlewares/category.middleware'); // si lo usas

// 1. GET → listar categorías (lo que usa el front)
router.get('/', categoryController.getAll);

// 2. POST → crear categoría (solo si lo necesitas en admin)
// router.post('/', validateCategory, categoryController.createCategory);

// 3. PUT → actualizar categoría
// router.put('/:id', validateCategory, categoryController.updateCategory);

// 4. DELETE → eliminar categoría
// router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
