const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    ca: require('fs').readFileSync(process.env.DB_SSL_CA)
  }
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a la BBDD:', err);
    return;
  }
  console.log('✅ Conexión exitosa a la BBDD');
  connection.end();
});
