const jwt = require('jsonwebtoken')

//========================
// Verificar Token - Viene en los headers
//========================


let checkToken = (req, resp, next) => {

    //Coge valor del header
    let token = req.get('token');

    jwt.verify(token, process.env.TOKEN_SEED, (error, decoded) => {

        if (error) {
            return resp.status(401).json({
                ok: false,
                message: error
            })
        }
        //El decode es el payload con el valor del objeto usuario
        //lo asignamos al request para poder acceder al objeto
        req.usuario = decoded.usuario;

        //Next continua con la ejecucion del programa que llamo a esta funcion
        next();
    })
}

//========================
// Verificar Token - Viene en la URL
//========================
let checkTokenURL = (req, resp, next) => {

    //Coge valor de la url
    let token = req.query.token;

    jwt.verify(token, process.env.TOKEN_SEED, (error, decoded) => {

        if (error) {
            return resp.status(401).json({
                ok: false,
                message: error
            })
        }
        //El decode es el payload con el valor del objeto usuario
        //lo asignamos al request para poder acceder al objeto
        req.usuario = decoded.usuario;

        //Next continua con la ejecucion del programa que llamo a esta funcion
        next();
    })
}

let checkRole = (req, resp, next) => {

    let role = req.usuario.role;

    if (role !== 'ADMIN_ROLE') {
        return resp.json({
            ok: false,
            message: 'No tienes privilegios suficientes para ejecutar esta tarea.'
        })
    }

    next();
}

module.exports = {
    checkToken,
    checkTokenURL,
    checkRole
}