const yup = require('yup');

const userSchema = yup.object().shape({
    nombre: yup.string().strict().trim().min(1, "El nombre no puede estar vacío").max(100).required("El nombre es obligatorio"),
    apellidos: yup.string().strict().trim().min(1, "Los apellidos no pueden estar vacíos").max(200).required("Los apellidos son obligatorios"),
    email: yup.string().strict().email("Email inválido").max(100).required("El email es obligatorio"),
    usuario: yup.string().strict().trim().min(1, "El usuario no puede estar vacío").max(100).required("El usuario es obligatorio"),
    password: yup.string().strict().trim().min(1, "La contraseña no puede estar vacía").max(100).required("La contraseña es obligatoria"),
    foto: yup.string().strict().url("La foto debe ser una URL válida").max(300).nullable(),
    fecha_nacimiento: yup.string().strict().trim().min(1, "La fecha no puede estar vacía").max(45).required("La fecha de nacimiento es obligatoria"),
    direccion: yup.string().strict().trim().min(1, "La dirección no puede estar vacía").max(200).required("La dirección es obligatoria")
});



module.exports = { userSchema };