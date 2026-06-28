const UserModel = require('../models/users.model');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const getAll = async (req, res) => {
    try {
        const users = await UserModel.getAll();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Hay un error gravísimo'
        });
    }
}

const getById = async (req, res) => {
    try {
        // Extraemos el usuario inyectado limpiamente por el middleware checkUserId
        const usuario = req.usuarioEncontrado;
        res.json(usuario);
    } catch (error) {
        console.error('Error en getById controller:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el usuario' });
    }
};

// Obtener usuarios nuevos mensuales y mes anterior
// const getUsersStats = async (req, res) => {

//     console.log ('entramos en getUsersStats')
//   try {
//     const current = await UserModel.selectUsersCurrentMonth();
//     const last = await UserModel.selectUsersLastMonth();
//     res.json({
//       usuariosMesActual: current.total,
//       usuariosMesAnterior: last.total,
//     });
//     console.log('ENTRO AQUÍ MIGUEL');

//   } catch (error) {
//     console.error(error);
//     console.log('entramos en el error');
//     res.status(500).json({ error: "Error obteniendo estadísticas de usuarios" });
//   }
// };

const create = async (req, res) => {
    try {
        const result = await UserModel.insert(req.body);
        const newUser = await UserModel.getById(result.insertId);

        if (!newUser) {
            return res.status(404).json({ message: 'No existe el usuario con ese ID' });
        }
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
}

const edit = async (req, res) => {
    try {
        const { userId } = req.params;
        const { nombre, apellidos, email, usuario, fecha_nacimiento, perfil, direccion, descripcion } = req.body;

        // 🕵️‍♂️ LOG CONTROL: Abre la terminal de tu backend y mira qué llega EXACTAMENTE aquí
        console.log("-> DIRECCIÓN ENTRANTE AL CONTROLADOR:", req.body.direccion);

        // Usuario actual del middleware (checkUserId)
        const usuarioActual = req.usuarioEncontrado;

        let fotoFinal = usuarioActual.foto;
        if (req.file) {
            fotoFinal = req.file.filename;
        }

        // Aseguramos que si viene un string vacío o undefined usemos el fallback correcto
        const direccionA_Guardar = direccion ? direccion.trim() : '';

        await db.query(
            `UPDATE usuarios 
             SET nombre = ?, apellidos = ?, email = ?, usuario = ?, foto = ?, fecha_nacimiento = ?, perfil = ?, direccion = ?, descripcion = ? 
             WHERE id = ?`,
            [
                nombre || null,
                apellidos || null,
                email || null,
                usuario || null,
                fotoFinal,
                fecha_nacimiento || null,
                perfil || 'USUARIO',
                direccionA_Guardar, // <--- Forzamos la variable limpia aquí
                descripcion || null,
                userId
            ]
        );

        const userUpdated = await UserModel.getById(userId);
        res.json({ message: 'Usuario actualizado correctamente', user: userUpdated });

    } catch (error) {
        console.error('Error en edit controller:', error);
        res.status(500).json({ message: 'Error interno en el servidor al actualizar el usuario' });
    }
}

const remove = async (req, res) => {
    try {
        const { userId } = req.params;

        // Borrado directo en la base de datos
        await db.query('DELETE FROM usuarios WHERE id = ?', [userId]);
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
}

//31052026 - F4eature Login/SignUp
const register = async (req, res) => {
    try {
        // Body: username, email, password
        req.body.password = bcrypt.hashSync(req.body.password, 8);

        const result = await UserModel.insert(req.body);
        res.json({
            message: 'Registro completo'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el registro' });
    }
}

// Nueva función controladora para la ruta de estadísticas
const getStatistics = async (req, res) => {
    try {
        const { userId } = req.params;
        const stats = await UserModel.getStats(userId);

        // Si el usuario no tiene ninguna interacción aún, devolvemos contadores a cero de forma segura
        if (!stats) {
            return res.json({
                total_vendidos: 0,
                total_valoraciones: 0,
                rating_media: 0.0
            });
        }

        res.json(stats);
    } catch (error) {
        console.error('Error en getStatistics controller:', error);
        res.status(500).json({ message: 'Error en el servidor al calcular estadísticas reales.' });
    }
}

// const getUsersStats = async (req, res) => {

//     console.log ('entramos en getUsersStats')
//   try {
//     const current = await UserModel.selectUsersCurrentMonth();
//     const last = await UserModel.selectUsersLastMonth();
//     res.json({
//       usuariosMesActual: current.total,
//       usuariosMesAnterior: last.total,
//     });
//     console.log('ENTRO AQUÍ MIGUEL');

//   } catch (error) {
//     console.error(error);
//     console.log('entramos en el error');
//     res.status(500).json({ error: "Error obteniendo estadísticas de usuarios" });
//   }
// };

const getValoraciones = async (req, res) => {
    try {
        const { userId } = req.params;
        const valoraciones = await UserModel.getValoraciones(userId);

        // 1. Primero validamos si está vacío
        if (!valoraciones || valoraciones.length === 0) {
            // Devolvemos un array vacío para que el frontend (listaValoraciones.length === 0) funcione correctamente
            return res.json([]);
        }

        // 2. Si tiene datos, los enviamos una sola vez
        return res.json(valoraciones);

    } catch (error) {
        console.error('Error en getValoraciones controller:', error);
        return res.status(500).json({ message: 'Error en el servidor al obtener valoraciones.' });
    }
}

const getUsuariosByRange = async (req, res) => {
    try {
// 1. Captura el rango de la URL 
const { range } = req.params; 

// 2. Llama al modelo pasando el rango
const usuarios = await usuariosModel.selectUsersByRange(range);

// 3. Responde al frontend con los datos 
return res.status(200).json(usuarios);
    } catch (error) {
// Manejo de errores por si falla la base de datos
return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll, 
    getById, 
    create, 
    edit, 
    remove, 
    register, 
    getStatistics, 
    getValoraciones, 
    getUsuariosByRange
}