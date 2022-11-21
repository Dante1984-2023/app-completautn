const express = require('express');
const app = express();
const mysql = require('mysql2');

// motor de plantilla
const hbs = require('hbs');

//Encontrar archivos
const path = require('path');

//Para mandar mail
const nodemailer = require('nodemailer');

//Variables de entorno
require('dotenv').config();

//Configuramos el puerto
const PORT = process.env.PORT || 9000; //trae la configuracion de .env
//console.log(PORT);
console.log(process.env.EMAIL);

//Middelware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));  //busca archivos de html, css ,etc


//Configuramos el motor de plantillas de HBS
app.set('view engine', 'hbs'); // utilizamos para la ingeniria de plantillas  handlebars
// Configuramos la ubicacion de las plantillas
app.set('views', path.join(__dirname, 'views')); //las vistas se van a encontrtar en la carpeta vistas
//Configuramos los parciales de los motores de plantillas
hbs.registerPartials(path.join(__dirname, 'views/partials'));  //Busca los parciales dentro de vistas y se llama parcial (path busca los archivos). 



//Conexion a la base de datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DBPORT
})
conexion.connect((err)=>{
    if(err) throw err;
    console.log(`Conectado a la Database ${process.env.DATABASE}`);
})

//Rutas de la aplicacion
app.get('/', (req, res)=>{
    res.send('Bienvenido a la App Completa')
})


// Servidor a la escucha de las peticiones
app.listen(PORT, ()=>{
    console.log(`Servidor trabajando en el puerto: ${PORT}`)
})




