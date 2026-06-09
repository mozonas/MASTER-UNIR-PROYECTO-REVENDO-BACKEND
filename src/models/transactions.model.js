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

//** Obtener las transacciones anuales */
const selectByYear = async (year) =>{
    const [result] = await db.query (
        'SELECT fecha FROM transacciones WHERE YEAR(fecha)= ? ORDER BY fecha ASC',
        [year]
    );
    return result [0];
};

//** Obtener transacciones mensuales por año */
const selectByMonth = async (year)=>{
    const [result] = await db.query(`
    SELECT MONTH (fecha) AS mes, COUNT(*) AS total
    FROM transacciones
    WHERE YEAR (fecha)=?
    GROUP BY mes
    ORDER BY mes ASC`, 
    [year]);
    return result;
}

//**Obtener transacciones por mes de dos años diferentes */
const selectByYears = async (yearA, yearB) => {
  const [result] = await db.query(`
    SELECT 
      YEAR(fecha) AS year,
      MONTH(fecha) AS mes,
      COUNT(*) AS total
    FROM transacciones
    WHERE YEAR(fecha) IN (?, ?)
    GROUP BY year, mes
    ORDER BY year, mes
  `, [yearA, yearB]);
  return result;
}

const insert = async (fecha, usuarios_id, articulos_id)=>{
    const [result] = await db.query (`
        INSERT INTO transacciones (fecha, usuarios_id, articulos_id)
        VALUES (?,?,?)
        `, [fecha, usuarios_id, articulos_id]);
        return result
}

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
    selectByYear,
    selectByYears,
    insert,
    updateById,
    deleteById
    
}
