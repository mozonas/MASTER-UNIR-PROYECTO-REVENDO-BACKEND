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
        if (result.length === 0) return null
        return result [0];
};


//**Obtener actividad por usuario de un mes*/
const selectByMonth = async () =>{
    const [result] = await db.query (`
        SELECT COUNT(DISTINCT usuarios_id) AS total
        FROM transacciones
        WHERE MONTH(fecha) = MONTH(CURRENT_DATE())
        AND YEAR(fecha) = YEAR(CURRENT_DATE())`
    );
        return result[0];
}

//** Obtener actividad por usuario mes anterior */
const selectByLastMonth = async ()=>{
    const [result] = await db.query(`
    SELECT COUNT(DISTINCT usuarios_id) AS total
    FROM transacciones
    WHERE MONTH(fecha) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH)
    AND YEAR(fecha) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH)`
    );
    return result[0];
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
    selectByMonth,
    selectByLastMonth,
    insert,
    updateById,
    deleteById
    
}
