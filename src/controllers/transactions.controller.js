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
      const { transactionId } = req.params;
      const data = await TransactionModel.selectById(transactionId);
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
        const nuevaVenta = await TransactionModel.selectById (result.insertId)
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
        const {transactionId} = req.params;
        const updated = await TransactionModel.updateById(transactionId, req.body);

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
        const {transactionId} = req.params;
        const result = await TransactionModel.deleteById(transactionId);
        if(result === 0){
            return res.status(404).json({ error: 'Transacción no encontrada' });
        }
        res.json({ message: 'Transacción eliminada' });
    } catch (error) {
        console.error(error);
      res.status(500).json({ error: 'Error eliminando la transacción' });
    }
}

//**Compra de un artículo: el comprador llega en el body, sin autenticación de servidor por ahora */
const comprar = async (req, res) => {
    try {
        const { articleId } = req.params;
        const { usuarios_id } = req.body;

        if (!usuarios_id) {
            return res.status(400).json({ message: 'Falta el id del comprador' });
        }

        const resultado = await TransactionModel.comprarArticulo(articleId, usuarios_id);

        if (resultado.error === 'NOT_FOUND') {
            return res.status(404).json({ message: 'El artículo no existe' });
        }
        if (resultado.error === 'OWN_ARTICLE') {
            return res.status(400).json({ message: 'No puedes comprar tu propio artículo' });
        }
        if (resultado.error === 'NOT_AVAILABLE') {
            return res.status(409).json({ message: 'El artículo ya no está disponible' });
        }

        res.status(201).json({
            message: 'Compra realizada correctamente',
            transaccionId: resultado.transaccionId
        });
    } catch (error) {
        console.error('Error en comprar:', error);
        res.status(500).json({ message: 'Error al procesar la compra' });
    }
}

module.exports ={
    getAll,
    getById,
    getActiveUsersByMonth,
    create,
    edit,
    remove,
    comprar
}
