const db = require('../config/db');

//Implementación de las consultas necesarias para el modelo de transacciones
const selectAll = async ()=>{
    const [result] = await db.query(`
        SELECT fechas FROM transacciones ORDER BY fecha ASC`
    );
    return result
}
const selectById = async (id)=> {
    const [result] = await db.query (
        'SELECT * FROM transacciones WHERE id_transaccion = ?',[id]);
        return result 
};


//** Obtener transacciones mensuales por año */
const selectByYear = async (year)=>{
    const [rows] = await db.query(`
    SELECT MONTH (fecha) AS mes, COUNT(*) AS total
    FROM transacciones
    WHERE YEAR (fecha)=?
    GROUP BY mes
    ORDER BY mes ASC`, 
    [year]);

    const ventas = Array(12).fill(0);

    rows.forEach (row =>{ 
        ventas[row.mes -1] = row.total;
    });

    return {ventas};
}


//**Nueva transacción en la tabla con id usuario y articulo y fecha */
const insert = async (fecha, usuarios_id, articulos_id)=>{
    const [result] = await db.query (`
        INSERT INTO transacciones (fecha, usuarios_id, articulos_id)
        VALUES (?,?,?)
        `, [fecha, usuarios_id, articulos_id]);
        return result
}

//**Midifcar datos de la transacción */
const updateById = async (transaccionesId, {fecha, usuarios_id, articulos_id})=>{
    const [result] = await db.query(
        `UPDATE FROM transacciones SET
        fecha =?,
        usuarios_id =?,
        articulos_id =?
        WHERE id = ?`,[fecha, usuarios_id, articulos_id, transaccionesId]
    )
    return result.affectedRows
}

//**Borrado de la transacción */
const deleteById = async (id)=> {
    const [result] = await db.query(`
        DELETE FROM transacciones
        WHERE id =?`, [id]);
        return result.affectedRows

} 

 
module.exports ={
    selectAll,
    selectById,
    selectByYear,
    insert,
    updateById,
    deleteById
    
}
