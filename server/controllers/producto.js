const express = require('express');
const app = express();
const { checkToken } = require('../middlewares/authentication');

const Producto = require('../models/producto');


app.get('/producto', checkToken, (req, resp) => {

    let from = req.query.from || 0;
    let limit = req.query.limit || 5;

    Producto.find({ available: true }) //Filtro
        .skip(Number(from))
        .limit(Number(limit))
        //Busca la información en la colección usuarios y categorias a partir del id. 
        .populate('user', 'name email') //Nombre del atributo del objeto producto. El segundo parametro son los campos del objeto usuario que queremos mostrar
        .populate('category', 'description') // Nombre del atributo del objeto producto. Igual que el anterior, campos que deseamos mostrar de categoria.
        .exec((error, productos) => {

            if (error) {
                return resp.status(400).json({
                    ok: false,
                    message: error
                })
            }

            Producto.count({}, (error, count) => {
                resp.json({
                    ok: true,
                    productos,
                    count
                })
            })
        })
})


app.get('/producto/:id', checkToken, (req, resp) => {

    let id = req.params.id;

    Producto.findById(id)
        //Busca la información en la colección usuarios y categorias a partir del id. 
        .populate('user', 'name email') //Nombre del atributo del objeto producto. El segundo parámetro son los campos del objeto usuario que queremos mostrar
        .populate('category', 'description') // Nombre del atributo del objeto producto. Igual que el anterior, campos que deseamos mostrar de categoria.
        .exec((error, producto) => {

            if (error) {
                return resp.status(500).json({
                    ok: false,
                    message: error
                })
            }

            if (!producto) {
                return resp.status(404).json({
                    ok: false,
                    message: 'No existe el producto.'
                })
            }

            resp.json({
                ok: true,
                producto
            })
        })
})



app.get('/producto/buscar/:cadena', checkToken, (req, resp) => {

    let cadena = req.params.cadena;

    //Creamos una expresion regular con la cadena de texto que nos venga en la petición
    let regexp = new RegExp(cadena, 'i'); //El parametro i hace que no se toman en cuenta las mayusculas.

    Producto.find({ name: regexp })
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((error, productos) => {

            if (error) {
                return resp.status(500).json({
                    ok: false,
                    message: error
                })
            }

            resp.json({
                ok: true,
                productos
            })
        })
})


app.post('/producto', checkToken, (req, resp) => {

    let body = req.body;
    let producto = new Producto({
        name: body.name,
        priceUnit: body.priceUnit,
        description: body.descripcion,
        available: body.available,
        category: body.category,
        //Lo recogemos del checkToken
        user: req.usuario._id
    })

    producto.save((error, producto) => {

        if (error) {
            return resp.status(500).json({
                ok: false,
                message: error
            })
        }

        if (!producto) {
            return resp.status(400).json({
                ok: false,
                message: error
            })
        }

        resp.json({
            ok: true,
            producto: producto
        })

    })
})

app.put('/producto/:id', checkToken, (req, resp) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (error, producto) => {

        if (error) {
            return resp.status(500).json({
                ok: false,
                message: error
            })
        }

        if (!producto) {
            return resp.status(400).json({
                ok: false,
                message: 'No existe el producto.'
            })
        }

        resp.json({
            ok: true,
            producto
        })
    });

})


app.delete('/producto/:id', (req, resp) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { available: false }, (error, producto) => {

        if (error) {
            return resp.status(500).json({
                ok: false,
                message: error
            })
        }

        if (!producto) {
            return resp.status(400).json({
                ok: false,
                message: 'No existe el producto.'
            })
        }

        resp.json({
            ok: true,
            message: 'Producto borrado.'
        })
    })
})

module.exports = app;