const db = require('../config/db');

//Implementación de las consultas necesarias para el modelo de transacciones
const selectAll = async ()=>{
    const [result] = await db.query(`
        SELECT * FROM transacciones ORDER BY fecha ASC`
    );
    return result
}
const selectById = async (id)=> {
    const [result] = await db.query (
        'SELECT * FROM transacciones WHERE id = ?',[id]);
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


//**Nueva transacción en la tabla con id usuario, articulo, fecha y precio */
const insert = async ({ fecha, usuarios_id, articulos_id, precio })=>{
    const [result] = await db.query (`
        INSERT INTO transacciones (fecha, usuarios_id, articulos_id, precio)
        VALUES (?,?,?,?)
        `, [fecha, usuarios_id, articulos_id, precio]);
        return result
}

//**Modificar datos de la transacción */
const updateById = async (id, { fecha, usuarios_id, articulos_id, precio })=>{
    const [result] = await db.query(
        `UPDATE transacciones SET
        fecha = ?,
        usuarios_id = ?,
        articulos_id = ?,
        precio = ?
        WHERE id = ?`,[fecha, usuarios_id, articulos_id, precio, id]
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

//**Compra de un artículo: crea la transacción y marca el artículo como VENDIDO de forma atómica */
const comprarArticulo = async (articuloId, compradorId) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [articulos] = await conn.query(
            `SELECT estadoVenta, precio, usuarios_id FROM articulos WHERE id = ?`,
            [articuloId]
        );
        const articulo = articulos[0];

        if (!articulo) {
            await conn.rollback();
            return { error: 'NOT_FOUND' };
        }
        if (articulo.usuarios_id === Number(compradorId)) {
            await conn.rollback();
            return { error: 'OWN_ARTICLE' };
        }
        if (articulo.estadoVenta !== 'DISPONIBLE') {
            await conn.rollback();
            return { error: 'NOT_AVAILABLE' };
        }

        const [insertResult] = await conn.query(
            `INSERT INTO transacciones (fecha, usuarios_id, articulos_id, precio) VALUES (NOW(), ?, ?, ?)`,
            [compradorId, articuloId, articulo.precio]
        );

        // Guarda anti-concurrencia: solo actualiza si sigue DISPONIBLE en este instante
        const [updateResult] = await conn.query(
            `UPDATE articulos SET estadoVenta = 'VENDIDO' WHERE id = ? AND estadoVenta = 'DISPONIBLE'`,
            [articuloId]
        );

        if (updateResult.affectedRows === 0) {
            await conn.rollback();
            return { error: 'NOT_AVAILABLE' };
        }

        await conn.commit();
        return { transaccionId: insertResult.insertId };
    } catch (error) {
        await conn.rollback();
        console.error('Error al comprar el artículo:', error);
        throw error;
    } finally {
        conn.release();
    }
};


module.exports ={
    selectAll,
    selectById,
    selectByMonth,
    selectByLastMonth,
    insert,
    updateById,
    deleteById,
    comprarArticulo,

}
