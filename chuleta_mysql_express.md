# 🚀 Chuleta de Configuración: Express.js + MySQL Remoto

Guía rápida de referencia para configurar un servidor Node.js/Express y conectarlo de forma segura a cualquier base de datos MySQL remota (AWS, DigitalOcean, Hostinger, Clever Cloud, etc.) utilizando **Pool de conexiones** y **Async/Await**.

---

## 📦 1. Inicialización e Instalación

Ejecuta estos comandos en la terminal de tu proyecto:

```bash
# Inicializar el proyecto Node.js
npm init -y

# Instalar Express, el driver moderno de MySQL y el gestor de entorno
npm install express mysql2 dotenv

# Instalar nodemon como dependencia de desarrollo
npm install --save-dev nodemon
```

En tu archivo `package.json`, añade el script de arranque dentro del objeto `"scripts"`:
```json
"scripts": {
  "dev": "nodemon app.js"
}
```

---

## 🔐 2. Variables de Entorno (`.env`)

Crea un archivo llamado `.env` en la raíz del proyecto. **Nunca** subas este archivo a GitHub.

```env
PORT=3000

# Credenciales del servidor MySQL remoto
DB_HOST=tu-servidor-remoto.com o direccion_ip_remota
DB_USER=usuario_remoto
DB_PASSWORD=contraseña_segura_remota
DB_NAME=nombre_de_la_base_de_datos
DB_PORT=3306
```

---

## 📁 3. Configuración del Pool de Conexiones (`config/db.js`)

Crea el archivo `config/db.js`. El Pool optimiza el rendimiento reutilizando conexiones en entornos remotos de alta latencia.

```javascript
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  
  // OPTIMIZACIONES PARA BASES DE DATOS REMOTAS
  waitForConnections: true,
  connectionLimit: 10,       // Ajustar según el plan de tu hosting
  queueLimit: 0,
  connectTimeout: 10000,     // 10 segundos de margen de espera
  
  // Descomenta la línea de abajo si tu hosting exige conexión encriptada SSL (ej. AWS/Azure):
  // ssl: { rejectUnauthorized: false } 
}).promise(); // Permite trabajar con promesas (Async/Await)

// Test de conexión inmediato al arrancar el servidor
pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión exitosa a la base de datos MySQL remota.');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error crítico de conexión remota:', err.message);
  });

module.exports = pool;
```

---

## 🖥️ 4. Servidor Express Base (`app.js`)

Crea el archivo principal `app.js` en la raíz de tu proyecto:

```javascript
const express = require('express');
const db = require('./config/db'); 
require('dotenv').config();

const app = express();

// Middleware esencial para procesar peticiones JSON
app.use(express.json());

// 📋 ENDPOINT DE LECTURA (GET)
app.get('/api/datos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tu_tabla LIMIT 10');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Fallo al consultar el servidor remoto', detalle: error.message });
  }
});

// 📥 ENDPOINT DE INSERCIÓN SEGURO (POST)
app.post('/api/datos', async (req, res) => {
  const { campo1, campo2 } = req.body;
  try {
    // Uso de "?" para prevenir ataques de inyección SQL
    const query = 'INSERT INTO tu_tabla (columna1, columna2) VALUES (?, ?)';
    const [result] = await db.query(query, [campo1, campo2]);
    
    res.status(201).json({ mensaje: 'Registro creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al insertar los datos', detalle: error.message });
  }
});

// Lanzar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express ejecutándose en http://localhost:${PORT}`);
});
```

---

## 🚨 Solución de Problemas Comunes en Remoto

Si recibes errores como `ETIMEDOUT` o `ECONNREFUSED`, revisa lo siguiente:

1. **Permisos de IP (Whitelisting):** Tu base de datos remota suele bloquear conexiones externas por seguridad. Entra al panel de tu hosting y añade tu IP actual a la lista blanca, o permite accesos globales (`0.0.0.0/0`).
2. **Puerto bloqueado:** Comprueba que tu proveedor (o tu router/firewall local) no tenga cerrado el tráfico saliente o entrante a través del puerto `3306`.
3. **Seguridad Git:** Añade `.env` dentro de tu archivo `.gitignore` antes de subir código a repositorios públicos.

## 📁 2.5. Configuración del Archivo de Seguridad (`.gitignore`)

**¡Obligatorio al iniciar el proyecto!** El archivo `.gitignore` le dice a Git qué archivos no debe rastrear ni subir jamás a repositorios públicos como GitHub.

### 🛠️ Creación desde la terminal Hyper:
- **Mac / Linux:** `touch .gitignore`
- **Windows:** `New-Item .gitignore`

### 📄 Contenido recomendado para copiar dentro de `.gitignore`:
```text
# 🔐 Seguridad: Bloquea tus contraseñas y accesos remotos
.env
.env.local

# 📦 Rendimiento: Evita subir carpetas gigantes que se regeneran con 'npm install'
node_modules/

# 🖥️ Basura del sistema y editores
.DS_Store
.vscode/
npm-debug.log*
```

### 🚨 Alerta de seguridad para el desarrollador:
Si por error haces un commit de tu archivo `.env` antes de meterlo en el `.gitignore`, Git lo recordará en su historial para siempre. Para sacarlo del radar de Git sin borrarlo de tu ordenador, ejecuta en Hyper:
```bash
git rm --cached .env
```
