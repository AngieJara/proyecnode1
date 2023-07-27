//importar
const express = require('express');
const morgan = require('morgan');
const exphbs =  require('express-handlebars');
const path =require('path');
const flash =require('connect-flash');
const session =require('express-session');
const MySqlStore = require('express-mysql-session');
const { database } = require('./keys');
const passport=require('passport');

//inicializacion
const app = express();
require('./lib/passport');

// configuraciones
app.set('port', process.env.PORT||4000);
app.set('views',path.join(__dirname,'views'));
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main",

 // defaultlayout:'main', 
   //indica una carpeta dentro de otra 
  layoutsDir:path.join(app.get('views'), 'layouts'),
  partialsDir:path.join(app.get('views'), 'partials'),
  //extname:'.hbs',
  helpers: require('./lib/handlebars')
}));
app.set('view engine','.hbs');
//programas intermedios
app.use(morgan('dev'));
app.use(express.urlencoded({extender:false}));
app.use(express.json());

app.use(session({
  secret: 'faztmysqlnodesession',
  resave : false,
  saveUninitialized: false,
  //store: new MySqlStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// global variables
app.use((req,res,next)=>{
  app.locals.success =req.flash('success');
  app.locals.message =req.flash('message');
  app.locals.user =req.user;
  next();
});
//routes
/// ./referencia ficheros
app.use(require('./routes'));
//autenticar los usuarios
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));
app.use('/Life',require('./views/Life'));

//public
app.use(express.static(path.join(__dirname,'public')));
//inicializar el servidor


app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'))
})
