const express = require('express')
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express()
const bodyParser = require('body-parser')
const Usuario = require('../models/usuario')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {

    //Params opcionales
    let from = req.query.from || 0;
    let limit = req.query.limit || 5;

    Usuario.find({ estatus: true /*opciones de filtro tal como google:true o estatus: false */ }, 'nombre email role estatus img google' /* Solo muestra los campsos que detallemos aqui*/ )
        .skip(Number(from))
        .limit(Number(limit))
        .exec((error, usuarios) => {

            if (error) {
                return res.status(400).json({
                    ok: false,
                    message: error
                })
            }

            Usuario.count({ estatus: true /*opciones de filtro tal como google:true o estatus: false */ }, (error, count) => {

                res.json({
                    ok: true,
                    usuarios,
                    count
                });

            });
        })
})

app.post('/usuario', function(req, res) {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((error, usuarioDB) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                message: error
            })
        }
        //Una manera de no devolver el password por seguridad en el objeto Usuario
        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    //Utilizamos underscore para coger del objeto del body solo los campos que podemos actualizar en la peticion PUT
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'estatus', 'role']);

    Usuario.findOneAndUpdate(id, body, { new: true, runValidators: true }, (error, usuarioDB) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                message: error
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    //Borrado fisico del registro
    // Usuario.findByIdAndRemove(id, (error, usuarioRemoved) => {

    //     if (error) {
    //         return res.status(400).json({
    //             ok: false,
    //             message: error
    //         })
    //     }

    //     if (usuarioRemoved === null) {
    //         return res.status(400).json({
    //             ok: false,
    //             message: 'Usuario no encontrado'
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioRemoved
    //     })
    // })

    //Borrado lógico de un usuario
    Usuario.findByIdAndUpdate(id, { estatus: false }, (error, usuarioDB) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                message: error
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})


module.exports = app;