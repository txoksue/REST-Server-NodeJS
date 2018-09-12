require('./config/config')

const mongoose = require('mongoose');
const express = require('express')
const app = express();
const path = require('path');

//Configuración global de rutas
app.use(require('./controllers/index'));
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, (error, resp) => {

    if (error) {
        throw new Error(error);
    }

    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando peticiones en el puerto", process.env.PORT);
})