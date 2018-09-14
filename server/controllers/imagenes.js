const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { checkTokenURL } = require('../middlewares/authentication');

app.get('/imagen/:type/:id', checkTokenURL, (req, resp) => {

    let type = req.params.type;
    let id = req.params.id;

    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${id}`);

    if (fs.existsSync(pathImage)) {

        resp.sendFile(pathImage);

    } else {

        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        resp.sendFile(noImagePath);
    }
})

module.exports = app;