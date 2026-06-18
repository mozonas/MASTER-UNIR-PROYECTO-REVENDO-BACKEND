const Activity = require('../models/activity.model');


  const getDaily = async (req, res) => {
    try {
         const data = await Activity.getDailyActivity();
        res.json(data);
    } catch (error) {
        console.error ('error en getAll;', error);
        res.status(500).json ({
            message:'ERROR obteniendo actividad diaria'
        })
    }
   
  }

  const getWeekly = async (req, res) => {
    try {
        const data = await Activity.getWeeklyActivity();
        res.json(data);
    } catch (error) {
        console.error ('error en getAll;', error);
        res.status(500).json ({
            message:'ERROR obteniendo actividad semanal'
        })
    }
  }


 const getMonthly = async (req, res) => {
    try {
        const data = await Activity.getMonthlyActivity();
        res.json(data);
    } catch (error) {
        console.error ('error en getAll;', error);
        res.status(500).json ({
            message:'ERROR obteniendo actividad mensual'
        })
    }
  }

module.exports = {getDaily, getWeekly, getMonthly}