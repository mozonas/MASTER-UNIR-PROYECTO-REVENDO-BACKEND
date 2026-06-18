const express = require('express');
const { getAll } = require('../../models/categories.model');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const categories = await getAll();
        res.status(200).json({ status: 'success', data: categories });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener categorías' });
    }
});

module.exports = router;
