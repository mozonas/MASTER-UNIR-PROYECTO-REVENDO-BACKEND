
const express = require('express');
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
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

// Route configuration
app.use('/api', require('./routes/api'));

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        message: "Not found"
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    // Winston
    res.status(500).json({ message: err.message });
});

module.exports = app;

