const express = require('express');
const app = express();
const { checkToken, checkRole } = require('../middlewares/authentication');
const Categoria = require('../models/categoria');



app.get('/categoria', checkToken, (req, resp) => {

    Categoria.find({})
        .sort('descripcion') // Ordena los resultados por la descripcion
        //Busca la información en la colección usuarios a partir del id que devolvemos en las categorias.
        .populate('user', 'name email') //Nombre del atributo del objeto category. El segundo parámetro son los campos del objeto usuario que queremos mostrar.
        .exec((error, categorias) => {

            if (error) {
                return resp.status(400).json({
                    ok: false,
                    message: error
                })
            }

            Categoria.count({}, (error, count) => {
                resp.json({
                    ok: true,
                    categorias,
                    count
                })
            })
        })
})


app.get('/categoria/:id', checkToken, (req, resp) => {

    let id = req.params.id;

    Categoria.findById(id, (error, categoria) => {

        if (error) {
            return resp.status(500).json({
                ok: false,
                message: error
            })
        }

        if (!categoria) {
            return resp.status(404).json({
                ok: false,
                message: 'No existe la categoría.'
            })
        }

        resp.json({
            ok: true,
            categoria
        })
    })
})


app.post('/categoria', checkToken, (req, resp) => {

    let body = req.body;
    let categoria = new Categoria({
        description: body.description,
        //Lo recogemos del checkToken
        user: req.usuario._id
    })

    categoria.save((error, categoria) => {

        if (error) {
            return resp.status(500).json({
                ok: false,
                message: error
            })
        }

        if (!categoria) {
            return resp.status(400).json({
                ok: false,
                message: error
            })
        }

        resp.json({
            ok: true,
            categoria: categoria
        })

    })
})


app.put('/categoria/:id', checkToken, (req, resp) => {

    let id = req.params.id;
    Categoria.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (error, categoria) => {

        if (error) {
            return resp.status(500).json({
                ok: false,
                message: error
            })
        }

        if (!categoria) {
            return resp.status(400).json({
                ok: false,
                message: 'No existe la categoría.'
            })
        }

        resp.json({
            ok: true,
            categoria
        })

    });

})


app.delete('/categoria/:id', [checkToken, checkRole], (req, resp) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (error, categoria) => {

        if (error) {
            return resp.status(500).json({
                ok: false,
                message: error
            })
        }

        if (!categoria) {
            return resp.status(400).json({
                ok: false,
                message: 'No existe la categoría.'
            })
        }

        resp.json({
            ok: true,
            categoria
        })
    })
})


module.exports = app