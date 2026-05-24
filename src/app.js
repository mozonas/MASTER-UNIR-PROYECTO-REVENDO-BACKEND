/* 
1. Importaciones de enrutadores
2. Inicializacion de la aplicacion
3. Vinculación de endpoints con enrutadores
4. Exportar la aplicacion para ser utilizada en el servidor
*/


// 1. Importaciones de enrutadores
const express = require('express');
const articleRouter = require('./src/routes/api/article.route');

// 2. Inicializacion de la aplicacion
const app = express();
console.log('Aplicacion Express inicializada.');

// 3. Vinculación de endpoints con enrutadores
app.use('/api/articles', articleRouter);
console.log('Enrutador de articulos vinculado a /api/articles.');

// 4. Exportar la aplicacion para ser utilizada en el servidor
module.exports = app;