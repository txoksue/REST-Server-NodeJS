const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../models/usuario');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
            usuario: userDB
        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

        resp.json({
            ok: true,
            usuario: userDB,
            token
        })

    })
})

app.post('/googleAuthentication', async(req, resp) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(error => {
            return resp.status(403).json({
                ok: false,
                message: error
            })
        })

    Usuario.findOne({ email: googleUser.email }, (error, usuarioDB) => {

        if (error) {
            return resp.status(500).json({
                ok: false,
                message: error
            })
        }

        if (usuarioDB) {
            if (!usuarioDB.google) {
                return resp.status(400).json({
                    ok: false,
                    message: 'Debe de usar su autenticación normal.'
                })
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                resp.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            let usuario = new Usuario({
                name: googleUser.name,
                email: googleUser.email,
                img: googleUser.picture,
                google: true,
                password: ':)'
            });

            usuario.save((error, usuarioDB) => {

                if (error) {
                    return resp.status(400).json({
                        ok: false,
                        message: error
                    })
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                resp.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })
        }
    })

})



async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


module.exports = app;