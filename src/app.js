const express = require('express');
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/uploads', express.static('public/uploads'));

app.use('/api', require('./routes/api'));   // ✔ SOLO UNA VEZ, y aquí

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

module.exports = app;
