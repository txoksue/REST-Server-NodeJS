const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../models/usuario');

app.post('/login', (req, resp) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (error, userDB) => {

        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            })
        }

        if (!userDB) {
            return resp.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario o password incorrectos.'
                }
            })
        }

        //Comprueba el password introducido con el que hay en BBDD (encriptados)
        if (!bcrypt.compareSync(body.password, userDB.password)) {

            return resp.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario o password incorrectos.'
                }
            })
        }

        //Creación del token que expira en 30 dias
        let token = jwt.sign({
            user: userDB
        }, 'seed-dev', { expiresIn: process.env.TOKEN_EXPIRATION });

        resp.json({
            ok: true,
            user: userDB,
            token
        })

    })


})

module.exports = app;