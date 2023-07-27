const express = require('express');
const router = express.Router();
const morgan = require('morgan');
//inicializacion
const app = express();

const passport=require('passport');
const { authenticate } = require('passport');
const{isLoggedIn, isNotLoggedIn} = require('../lib/auth');

const pool= require('../database');

router.get('/signup',isNotLoggedIn,(req,res)=>{
  console.log(req.body)  
  res.render('auth/signup');
});
//registro de usuario
router.post('/signup',isNotLoggedIn, passport.authenticate('local.signup', {
            successRedirect: '/links', 
            failureRedirect:'/signup',
            failureFash: true 
        }));
//ingreso de usuario
router.get('/signin',isNotLoggedIn, (req,res) => {
    res.render('auth/signin');
     
});
router.post('/signin',isNotLoggedIn, (req,res,next) => {
    passport.authenticate('local.signin', {
         successRedirect: '/links', 
         failureRedirect:'/signin',
         failureFash: true 
     })(req,res,next);
     
});
router.get('/', isLoggedIn, async (req, res) => {
  const tbl = await pool.query('SELECT * FROM usuarios set ?', user);
  console.log(tbl);
  res.render('links/list', { tbl });
});

router.get('/logout', (req, res) => {
    req.logOut(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/signin');
    });
  });

router.get('/Life',(req,res) => {
    res.render('Life')
      
});

router.get('/test',(req,res) => {
    res.render('test')
      
});
router.get('/', isLoggedIn, async (req, res) => {
  const tbl = await pool.query('SELECT * FROM usuarios set = ?',req.tbl);
  res.render('links/list', { tbl });
});
module.exports= router;