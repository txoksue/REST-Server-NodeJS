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

// if (process.env.NODE_ENV === 'dev') {
//     urlDB = 'mongodb://localhost:27017/CafeDB';
// } else {
urlDB = 'mongodb://test:123456a@ds251902.mlab.com:51902/cafedb';
//}

process.env.URLDB = urlDB;