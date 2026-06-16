const { getAll, getUserArticles, selectByThisMonth, selectByLastMonth } = require('../models/article.model');

const getAllUserArticles = async (req, res) => {
    try {
        const rawArticles = await getAll();

        return res.status(200).json({
            status: 'success',
            data: rawArticles
        });
    } catch (error) {
        console.error('Error al obtener los artículos:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener los artículos'
        });
    }
};

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
    getThisMonth,
    getLastMonth
};