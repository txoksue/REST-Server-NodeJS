const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

//Objecto para definir valores aceptados para el atributo role de Usuario
let rolesValid = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido.'
}

//Definimos el schema de la colección(tabla) Usuario de MongoDB 
let usuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio.']
    },
    email: {
        unique: true,
        type: String,
        required: [true, 'El correo es obligatorio.']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio.']
    },
    img: {
        type: String,
        required: false,
        default: ''
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValid
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Para no devolver el campo password. El método toJSON siempre se llama cuando queremos devolver el objeto Usuairo
//Nunca se usa una funcion de flecha.
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
}

//Mensaje custom para los campos que necesitan ser únicos
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico.' })

module.exports = mongoose.model('Usuario', usuarioSchema);