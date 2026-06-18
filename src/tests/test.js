require('dotenv').config();
const pool = require('../config/db.js');

pool.getConnection()
  .then(c => {
    console.log('✅ Conexión OK');
    c.release();
    process.exit(0);
  })
  .catch(e => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  });