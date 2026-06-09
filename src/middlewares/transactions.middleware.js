const TransactionModel = require ('../models/transactions.model');

const checkTransactionId = async (req, res, next)=>{
    const {transaccionId} = req.params;
    if (isNaN(transaccionId)){
        return res.status(400).json({message: 'El id del cliente debe ser un numero'});
    }
    const transaccion = await TransactionModel.selectById(transaccionId);
    if (!transaccion){
        return res.status (404)
        .json ({message: 'La transacción no existe con ese Id'});
    }

    req.transaccion = transaccion;

    next();

}

module.exports ={
    checkTransactionId
}