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
app.set('views', path.join(__dirname, 'views')); //las vistas se van a encontrar en el directorio principal en la carpeta vistas
//Configuramos los parciales de los motores de plantillas
hbs.registerPartials(path.join(__dirname, 'views/partials'));  //Busca los parciales dentro de vistas y se llama parcial (path busca los archivos). 


/*
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
*/
//Rutas de la aplicacion
app.get('/', (req, res)=>{
    res.render('index',{
        titulo: 'Titulo'
    })
})
app.get('/formulario', (req, res)=>{
    res.render('formulario',{
        titulo: 'Formulario'
    })
})


app.get('/productos', (req, res)=>{
    
    let sql = "SELECT * FROM productos";   // Se coloca cualquier consulta igual que con workbench
        conexion.query(sql, function(err, result){
            if (err) throw err;
                console.log(result);//para la entrega va comentado
                res.render('productos',{
                    titulo: 'Productos',
                    datos: result   /* el resultado de toda la tabla se guarda en datos */


                
        })
    
    
    
    })
})
app.get('/contacto', (req, res)=>{
    res.render('contacto',{
        titulo: 'Contactos'
    })
})


// ingresar datos a formulario
app.post('/formulario', (req,res)=>{
    
const nombre = req.body.nombre;
const precio = req.body.precio;
const descripcion = req.body.descripcion;

/* Se cargan todos las variables datos del formulario despues se agregan a la base de datos de abajo*/

let datos= {
    nombre: nombre,/*primer nombre viene de la base de datos el segundo de variable que creamos en el formulario frondend */
    precio: precio,
    descripcion: descripcion
}

let sql = "INSERT INTO productos set ?";

conexion.query(sql, datos, function(err){
    if (err) throw err;
        console.log('1 registro insertado');      
       /*   res.render('index')*/ 
        res.render('enviado') /* muestra la pagina hbs  despues de insertar un dato.
        esta pagina debe estar creada */
})

    /*  res.send(`Sus datos fueron recibidos ${nombre} - ${precio} - ${descripcion}`)*/
})

app.post('/contacto', (req, res) =>{
    const nombre = req.body.nombre;
    const email = req.body.email;
    
    
//creamos una funcion para enviar email al cliente. la sacamos de la pagina nodemailer
    
async function envioMail(){
    //Configuramos la cuenta del envío
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,  // puerto de gmail
        secure: true,
        auth: {                //autorizacion
            user: process.env.EMAIL,
            pass: process.env.EMAILPASSWORD
        }
    });

    //Envío del mail
    let info = await transporter.sendMail({
        from: process.env.EMAIL,//nuestro email
        to: `${email}`, //a quuien le mandamos el email
        subject: "Gracias por suscribirte a nuestra App",
        html:`Muchas gracias por visitar nuestra página <br>
        Recibirás nuestras promociones a esta dirección de correo. <br>
        Buen fin de semana!!`
    })
}


    let datos= {
        nombre: nombre,/*primer nombre viene de la base de datos el segundo de variable que creamos en el formulario frondend */
        email: email
        
    }
    //Insertamos los datos a la base de datos
    let sql = "INSERT INTO contactos set ?";// Tabla donde queremos que se cargue

conexion.query(sql, datos, function(err){
    if (err) throw err;
        console.log('1 registro insertado');      
        //EMAIL
        envioMail().catch(console.error);// envio correo si insetaron bien los datos
        res.render('enviado')
    })
     // res.send('Los datos fueron recibidos')// mensaje en la pagina 

})

    


// Servidor a la escucha de las peticiones
app.listen(PORT, ()=>{
    console.log(`Servidor trabajando en el puerto: ${PORT}`)
})






