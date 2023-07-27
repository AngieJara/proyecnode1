//crea ruta
const express = require('express');
const router = express.Router();

//definir ruta
router.get('/',( req,res)=>{
    res.render('index');
});
module.exports= router;
