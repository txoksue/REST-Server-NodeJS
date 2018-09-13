const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    description: {
        type: String,
        unique: true,
        required: [true, 'La descripción de la categoria es obligatoria.']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})


module.exports = mongoose.model('Categoria', categoriaSchema);