require('./config/config')

const mongoose = require('mongoose');
const express = require('express')
const app = express()

app.use(require('./controllers/usuarios'))

mongoose.connect(process.env.URLDB, (error, resp) => {

    if (error) {
        throw new Error(error);
    }

    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando peticiones en el puerto", process.env.PORT);
})