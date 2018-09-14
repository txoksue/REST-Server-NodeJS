const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');


// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function(req, resp) {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return resp.status(400).json({
            ok: false,
            message: 'No files were uploaded.'
        });
    }

    //Valida tipos
    let typesValid = ['productos', 'usuarios'];

    if (typesValid.indexOf(type) < 0) {
        return resp.status(400).json({
            ok: false,
            message: 'Tipo no permitido. Los tipos permitidos son ' + typesValid.join(', ')
        })
    }

    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let file = req.files.file;

    //Extensiones permitidas
    let extValid = ['jpg', 'gif', 'png', 'jpeg'];

    let fileNameAndExt = file.name.split('.');
    let extension = fileNameAndExt[fileNameAndExt.length - 1];

    //Comprueba que la extension esta dentro de las permitidas
    if (extValid.indexOf(extension) < 0) {

        return resp.status(400).json({
            ok: false,
            message: 'Extension no permitida. Las extensiones permitidas son ' + extValid.join(', ')
        });
    }

    //Cambiar nombre de archivo
    let customFileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(`uploads/${type}/${customFileName}`, (error) => {

        if (error) {
            return resp.status(500).json({
                ok: false,
                message: error
            });
        }

        if (type === 'usuarios') {
            imageUsuario(id, resp, customFileName);
        } else {
            imageProducto(id, resp, customFileName)
        }

    });
})

function imageUsuario(id, resp, customFileName) {

    Usuario.findById(id, (error, usuario) => {

        if (error) {

            deleteFile(customFileName, 'usuarios');

            return resp.status(400).json({
                ok: false,
                message: error
            })
        }

        if (!usuario) {

            deleteFile(customFileName, 'usuarios');

            return resp.status(400).json({
                ok: false,
                message: 'El usuario no existe.'
            })
        }

        //Borramos la imagen anterior que habia en BBDD, y guardamos la que subimos, como última versión
        deleteFile(usuario.img, 'usuarios');

        usuario.img = customFileName;

        usuario.save((error, usuario) => {

            if (error) {
                return resp.status(400).json({
                    ok: false,
                    message: error
                })
            }

            resp.json({
                ok: true,
                usuario
            });
        })
    })
}

function imageProducto(id, resp, customFileName) {

    Producto.findById(id, (error, producto) => {

        if (error) {

            deleteFile(customFileName, 'productos');

            return resp.status(400).json({
                ok: false,
                message: error
            })
        }

        if (!producto) {

            deleteFile(customFileName, 'productos');

            return resp.status(400).json({
                ok: false,
                message: 'El producto no existe.'
            })
        }

        //Borramos la imagen anterior que habia en BBDD, y guardamos la que subimos, como última versión
        deleteFile(producto.img, 'productos');

        producto.img = customFileName;

        producto.save((error, producto) => {

            if (error) {
                return resp.status(400).json({
                    ok: false,
                    message: error
                })
            }

            resp.json({
                ok: true,
                producto
            });
        })
    })
}

function deleteFile(imageName, type) {

    //Borrar el archivo si existe
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${imageName}`);

    if (fs.existsSync(pathImage)) {

        fs.unlinkSync(pathImage);
    }
}

module.exports = app;