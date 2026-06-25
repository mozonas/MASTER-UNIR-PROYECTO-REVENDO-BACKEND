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

const getActiveUsersByMonth = async (req,res) =>{
    try {
        const mesActual = await TransactionModel.selectByMonth();
        const mesAnterior = await TransactionModel.selectByLastMonth();
        res.json({
            mesActual: mesActual.total,
            mesAnterior: mesAnterior.total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'ERROR obteniendo usaurios activos' }) 
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
    getActiveUsersByMonth,
    create,
    edit,
    remove
}