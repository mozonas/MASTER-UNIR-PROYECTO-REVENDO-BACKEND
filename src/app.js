/* 1. Importaciones de librerías y enrutadores
2. Inicializacion de la aplicacion y middlewares globales
3. Vinculación de endpoints con enrutadores
4. Exportar la aplicacion para ser utilizada en el servidor
*/

// 1. Importaciones de librerías y enrutadores
const express = require('express');
const cors = require('cors'); // 👈 Instálalo ejecutando: npm install cors

const articleRouter = require('./routes/api/article.route');
const userRouter = require('./routes/api/users.route');

// 2. Inicializacion de la aplicacion y middlewares globales
const app = express();
console.log('Aplicacion Express inicializada.');

// Middleware para permitir peticiones desde tu frontend de Angular
app.use(cors({
    origin: 'http://localhost:4200', // 👈 El puerto por defecto donde corre Angular
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log('CORS habilitado para http://localhost:4200');

// Middleware para que Express pueda entender los datos en formato JSON que envíe Angular
app.use(express.json());

// 3. Vinculación de endpoints con enrutadores
app.use('/api/articles', articleRouter);
console.log('Enrutador de articulos vinculado a /api/articles.');

app.use('/api/usuarios', userRouter); // 👈 Vinculamos la ruta que espera tu UserService de Angular
console.log('Enrutador de usuarios vinculado a /api/usuarios.');

// 4. Exportar la aplicacion para ser utilizada en el servidor
module.exports = app;