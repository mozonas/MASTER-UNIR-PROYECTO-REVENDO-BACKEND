// Cargamos las variables de entorno (.env) antes de cualquier otra cosa
require('dotenv').config();

const http = require('http');
const app = require('./src/app');

// Configuramos el puerto 3000
const PORT = process.env.PORT || 3000;

// Creamos el servidor HTTP pasando nuestra app de Express
const server = http.createServer(app);

// Ponemos al servidor a escuchar
server.listen(PORT, () => {
    console.log(`\n🚀 Servidor de Revendo Backend corriendo en: http://localhost:${PORT}`);
    console.log(`📡 Esperando peticiones desde el frontend en el puerto 4200...\n`);
});

// Manejo básico de errores por si el puerto está ocupado
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Error en el servidor de Node: el puerto ${PORT} ya está en uso.`);
        console.error('   Cierra el proceso que usa ese puerto o configura otra variable PORT.');
    } else {
        console.error('❌ Error en el servidor de Node:', error.message);
    }
    process.exit(1);
});