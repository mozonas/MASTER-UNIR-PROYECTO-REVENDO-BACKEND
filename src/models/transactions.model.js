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

//Obtener ventas diarias de un mes

//--FUNCION PARA OBTENER DIAS REALES DEL MES--//
function getDiasMes(month, year) {
  return new Date(year, month, 0).getDate();
}

const selectByMonth = async (month, year) =>{
    const [result] = await db.query (`
        SELECT day (fecha) AS dia, COUNT(*) AS total
        FROM transacciones
        WHERE MONTH (fecha) =? AND YEAR (fecha)=?
        GROUP BY dia
        ORDER BY dia ASC`, 
        [month,year]);


        const totalDias = getDiasMes(month,year);
        const dias = Array(totalDias).fill(0);
        // Rellenar los días que sí tienen ventas
        result.forEach(row => {
          dias[row.dia-1] = row.total; // numero de ventas
        });
        // array de 30 posiciones correspondientes a un dia del mes con el numero de ventas diarias
        return {ventas: dias};

}

//** Obtener transacciones mensuales por año */
const selectByYear = async (year)=>{
    const [result] = await db.query(`
    SELECT MONTH (fecha) AS mes, COUNT(*) AS total
    FROM transacciones
    WHERE YEAR (fecha)=?
    GROUP BY mes
    ORDER BY mes ASC`, 
    [year]);

    // Convierto en array
    const ventas = Array(12).fill(0);
    
    if (!result || result.length === 0) {
       return { ventas };
    }

    // Obtengo las ventas de cada mes en cada posición correspondiente del array 
    result.forEach (row =>{ 
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
    selectByMonth,
    selectByYear,
    insert,
    updateById,
    deleteById
    
}
