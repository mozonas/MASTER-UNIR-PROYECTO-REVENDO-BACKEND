const Activity = require('../models/activity.model');

//**Creación de un controller activity para centralizar el modelo activity */
const getActivity = async (req, res) => {
  try {
    // 1. Captura el parámetro de la URL (:range) que viene de las rutas
    const { range } = req.params; 

    // 2. Llama al modelo unificado pasándole el rango dinámico
    const data = await Activity.getActivityByRange(range);
    
    // 3. Envía la respuesta única 
    res.json(data);
    
  } catch (error) {
    console.error(`Error en getActivity con rango [${req.params.range}]:`, error);
    res.status(500).json({
      message: `ERROR obteniendo la actividad seleccionada`
    });
  }
};

module.exports = { getActivity };