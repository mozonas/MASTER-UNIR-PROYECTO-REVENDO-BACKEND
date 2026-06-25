const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de almacenamiento en disco
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads';
        // Si la carpeta no existe, la creamos automáticamente
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Creamos un nombre único: timestamp_originalName.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de tipo imagen'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // Límite de 2MB
});

module.exports = upload;