require('dotenv').config();
const { getAll } = require('../models/users.models');

getAll()
    .then(users => {
        console.log(`✅ ${users.length} usuarios encontrados:`);
        users.forEach(u => console.log(`  - ${u.nombre} ${u.apellidos} (${u.perfil})`));
        process.exit(0);
    })
    .catch(e => {
        console.error('❌ Error:', e.message);
        process.exit(1);
    });