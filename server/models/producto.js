const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio.']
    },
    priceUnit: {
        type: Number,
        required: [true, 'El precio únitario es obligatorio.']
    },
    description: {
        type: String,
        required: false
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    img: {
        type: String,
        required: false,
    },
});


module.exports = mongoose.model('Producto', productoSchema);