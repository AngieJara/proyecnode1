
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers=require('../lib/helpers');

passport.use('local.signin',new LocalStrategy({
    usernameField: 'username',
    passwordFile:'password',
    passReqToCallback: true,
    },async (req,username,password, done)=>{
        const rows = await pool.query('SELECT * FROM usuarios WHERE username = ?',[username]);
        if (rows.length > 0 ){
            const user = rows[0];
            
            //validar contraseña
            const validPassword= await helpers.matchPassword(password,user.password)
            if(validPassword){
                done(null,user,req.flash('success','welcome'+user.username));
                
            }
            else{
                done(null,false,req.flash('message' ,'Incorret Pasword'));
            }
        }else{
            return done(null,false,req.flash('message','the Username does not exist'));
        }

}));


// registrarse
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordFile:'password',
    passReqToCallback: true,
    },async (req,username,password, done)=>{
    console.log(req.body);
    const { fullname,phone,email,country,city } = req.body;
    const newUser={
        username,
        password,
        fullname,
        phone,
        email,
        country,
        city
                
    };
    console.log(newUser);
    newUser.password=await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO usuarios SET ?',newUser);
    newUser.id=result.insertId;
    return done(null, newUser);
}));


passport.serializeUser((user,done)=>{
    done(null, user.id);
});

passport.deserializeUser(async(id,done)=>{
    const rows = await pool.query('SELECT * FROM usuarios Where id =  ?',[id]);
    done(null,rows [0]);
});
