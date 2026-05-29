require('dotenv').config();
const usersModel = require('../models/users.models');

const separator = (title) => console.log(`\n🔹 [TEST] ${title} ------------------`);

async function runSuite() {
    try {
        let tempUserId = null;
        const targetEmail = 'tester.revendo@mail.com';
        const targetUser = 'testrunner';

        // 1. Probar obtención general
        separator('Listar usuarios existentes (getAll)');
        const usuariosIniciales = await usersModel.getAll();
        console.log(`✅ Conexión con éxito. Hay ${usuariosIniciales.length} usuarios en la base de datos.`);
        if(usuariosIniciales.length > 0) {
            console.log(`   Ejemplo en DB: ${usuariosIniciales[0].nombre} ${usuariosIniciales[0].apellidos} (${usuariosIniciales[0].perfil})`);
        }

        // 2. Probar inserción con tus campos reales
        separator('Crear usuario de prueba (create)');
        const nuevoUser = {
            nombre: 'Carlos',
            apellidos: 'Tester Real',
            email: targetEmail,
            usuario: targetUser,
            password: 'hash_simulado_revendo_123',
            foto: 'usuariostest.jpg',
            perfil: 'USUARIO',
            fecha_nacimiento: '1995-05-29'
        };
        const creado = await usersModel.create(nuevoUser);
        tempUserId = creado.id;
        console.log(`✅ Usuario registrado en 'revendobd' con ID: ${tempUserId}`);

        // 3. Buscar por ID
        separator('Buscar por ID (getById)');
        const encontradoId = await usersModel.getById(tempUserId);
        console.log(`✅ Encontrado: ${enclosedLog(encontradoId)}`);

        // 4. Buscar por Email (Especial para Auth)
        separator('Buscar por Email (getByEmail)');
        const encontradoEmail = await usersModel.getByEmail(targetEmail);
        console.log(`✅ Encontrado por Email. Password guardado: ${encontradoEmail.password}`);

        // 5. Buscar por Nickname / Username
        separator('Buscar por Nickname (getByUsername)');
        const encontradoNick = await usersModel.getByUsername(targetUser);
        console.log(`✅ Encontrado por Username: ${encontradoNick.nombre} (ID: ${encontradoNick.id})`);

        // 6. Probar paginación
        separator('Comprobar paginación (getPaginated)');
        const pagina = await usersModel.getPaginated(3, 0);
        console.log(`✅ Paginación correcta. Traídos ${pagina.length} usuarios.`);

        // 7. Modificación Completa (PUT style)
        separator('Actualizar todo el registro (updateById)');
        const cambiosCompletos = {
            nombre: 'Carlos Modificado',
            apellidos: 'Tester Actualizado',
            email: 'carlos.update@mail.com',
            usuario: 'carlosup',
            foto: 'carlos_new.jpg',
            perfil: 'MODERADOR', // Escalamos a moderador en el test
            fecha_nacimiento: '1995-05-29'
        };
        const isUpdated = await usersModel.updateById(tempUserId, cambiosCompletos);
        if (isUpdated) {
            const verif = await usersModel.getById(tempUserId);
            console.log(`✅ Actualizado por completo. Nuevo Perfil: ${verif.perfil} | Nuevo Usuario: ${verif.usuario}`);
        }

        // 8. Modificación Parcial (PATCH style)
        separator('Cambio parcial dinámico (patchById)');
        const isPatched = await usersModel.patchById(tempUserId, { apellidos: 'Sólo Cambié El Apellido' });
        if (isPatched) {
            const verifPatch = await usersModel.getById(tempUserId);
            console.log(`✅ Parche aplicado. Registro final en DB: ${verifPatch.nombre} ${verifPatch.apellidos}`);
        }

        // 9. Borrado Físico para dejar la base de datos limpia
        separator('Limpieza de la base de datos (deleteById)');
        const isDeleted = await usersModel.deleteById(tempUserId);
        if (isDeleted) {
            console.log(`✅ Usuario de pruebas ID ${tempUserId} eliminado. Base de datos limpia.`);
        }

        console.log('\n🎉 ¡Batería de pruebas USUARIO finalizada con éxito!');
        process.exit(0);

    } catch (err) {
        console.error('\n❌ ERROR CRÍTICO EN LA EJECUCIÓN DE PRUEBAS:');
        console.error(err.message);
        process.exit(1);
    }
}

function enclosedLog(userObj) {
    return `${userObj.nombre} ${userObj.apellidos} (@${userObj.usuario}) - Nacimiento: ${userObj.fecha_nacimiento}`;
}

runSuite();