const TransactionModel = require ('../models/transactions.model');

const checkTransactionId = async (req, res, next)=>{
    const {transactionId} = req.params;
    if (isNaN(transactionId)){
        return res.status(400).json({message: 'El id de la transacción debe ser un numero'});
    }
    const transaccion = await TransactionModel.selectById(transactionId);
    if (!transaccion){
        return res.status (404)
        .json ({message: 'La transacción no existe con ese Id'});
    }

    req.transaccion = transaccion;

    next();

}

module.exports ={ checkTransactionId }