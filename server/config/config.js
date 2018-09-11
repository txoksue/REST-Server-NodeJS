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

// =========================
// EXPIRACIÓN TOKEN
//=========================
//60 Segundos
//60 Minutos
//24 Horas
//30 Dias

process.env.TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION ||  60 * 60 * 24 * 30;


// =========================
// SEED DEL TOKEN
//=========================

process.env.TOKEN_SEED = process.env.TOKEN_SEED ||  'seed-dev';