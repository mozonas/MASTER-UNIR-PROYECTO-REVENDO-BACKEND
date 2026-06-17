const TransactionModel = require('../models/transactions.model');

const getAll = async (req, res) =>{
    try{
        const ventas = await TransactionModel.selectAll();
        res.json (ventas);
    }catch(error){
        console.error ('error en getAll;', error);
        res.status(500).json ({
            message:'ERROR'
        })
    }
}

const getById = async (req, res) =>{
     try {
      const { id } = req.params;
      const data = await TransaccionesModel.getById(id);
      if (!data) {
        return res.status(404).json({ error: 'Transacción no encontrada' });
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error obteniendo la transacción' });
    }

}
// LOS DOS MÉTODOS DE SELECT POR FECHA AL FINAL NO SE USAN COMO VENTAS//
const getByMonth = async (req,res) =>{
    try {
        const {month} = req.params;
        const year = new Date().getFullYear()
        if(!month){
            return res.status (400).json ({
            message: 'parámetro month no recibido'
        })
    }
        const ventasMensuales = await TransactionModel.selectByMonth (month, year)
        res.json (ventasMensuales)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'ERROR obteniendo ventas mes' }) 
        }
}

const getByYear = async (req,res) =>{
    try {
      const { year } = req.params;
      
      if(!year){
        return res.status (400).json ({
            message: 'parámetro year no recibido'
        })
      }

      const ventasAnuales = await TransactionModel.selectByYear(year);
      res.json(ventasAnuales);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error obteniendo fechas por año' });
    }

}

const create = async (req,res) =>{
    try {
        const result = await TransactionModel.insert (req.body);
        const nuevaVenta = await TransactionModel.getById (result.insertId)
        if (!nuevaVenta){
         return res.status(404).json ({message: 'No existe la transacción con ese ID'})
        }
        res.status (201).json (nuevaVenta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creando la transacción' })
    }
}

const edit = async (req,res)=>{
    try{
        const {id} = req.params;
        const updated = await TransaccionesModel.update(id, req.body);

        if (updated === 0) {
        return res.status(404).json({ error: 'Transacción no encontrada' });
        }

        res.json({ message: 'Transacción actualizada correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error actualizando la transacción' });
    }
}

const remove = async (req,res) =>{
    try {
        const {ventaId} = req.params;
        const result = await TransactionModel.deleteById(id);
        if(result === 0){
            return res.status(404).json({ error: 'Transacción no encontrada' });
        }
        res.json({ message: 'Transacción eliminada' });
    } catch (error) {
        console.error(error);
      res.status(500).json({ error: 'Error eliminando la transacción' });
    }
}

module.exports ={
    getAll,
    getById,
    getByMonth,
    getByYear,
    create,
    edit,
    remove
}