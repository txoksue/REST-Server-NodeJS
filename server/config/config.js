// =========================
// PUERTO
//=========================

process.env.PORT = process.env.PORT || 8080;


// =========================
// ENTORNO
//=========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =========================
// BASE DE DATOS
//=========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/CafeDB';
} else {
    urlDB = process.env.MONGO_URI_DB;
}

process.env.URLDB = urlDB;