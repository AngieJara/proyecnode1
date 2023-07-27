const express = require('express');
const router = express.Router();

const pool= require('../database');

const{isLoggedIn} = require('../lib/auth');
//isLoggedIn =privilegia las paginas
router.get('/add',isLoggedIn,(req,res)=>{
    
    res.render('links/add');
});

router.post('/add',isLoggedIn, async(req,res)=>{
    const {title,url,description}=req.body;
    const newLink = {
        title,
        url,
        description,
        user_id:req.user.id
    };
    // guarda los datos en la tabla de db 
    await pool.query('INSERT INTO links set ?', newLink);
    req.flash('success','Link saved succesfully');
    res.redirect('/links');
});
router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links });
});
router.get('/table', isLoggedIn, async (req, res) => {
    const  tbl= await pool.query('SELECT * FROM usuarios');
    res.render('links/vtbl', { tbl });
});
router.get('/delete/:id',isLoggedIn,async (req,res)=>{
    const {id}= req.params;
    await pool.query('DELETE FROM links WHERE ID=?',[id]);
    req.flash('success','Link delet succesfully');
    res.redirect('/links');
});

router.get('/deleteuser/:id',isLoggedIn,async (req,res)=>{
    const {id}= req.params;
    await pool.query('DELETE FROM usuarios WHERE ID=?',[id]);
    req.flash('success','Ususario delet succesfully');
    res.redirect('/links/table');
});

//modificar de la DB
router.get('/edituser/:id',isLoggedIn,async (req,res)=>{
    const {id}= req.params;
    const edtuser = await pool.query('SELECT * FROM usuarios WHERE id = ?',[id]);
    console.log(edtuser)
    res.render('links/edituser',{edtuser:edtuser[0] });
});
router.post('/edituser/:id',isLoggedIn,async (req,res)=>{
    const {id}= req.params;
    const { username,password,fullname,phone,email,country,city } = req.body;
    const newUser={
        username,
        password,
        fullname,
        phone,
        email,
        country,
        city
                
    };
    await pool.query('UPDATE usuarios set ? WHERE id = ?',[newUser,id]);
    req.flash('success','User Updated succesfully');
    res.redirect('/links/table');
});
//eliminar de la DB
/*router.get('/delete/:id',isLoggedIn,async (req,res)=>{
    const {id}= req.params;
    await pool.query('DELETE FROM links WHERE ID=?',[id]);
    req.flash('success','Link delet succesfully');
    res.redirect('/links');
});*/
//modificar de la DB
router.get('/edit/:id',isLoggedIn,async (req,res)=>{
    const {id}= req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?',[id]);
    res.render('links/edit',{ link:links[0] });
});
router.post('/edit/:id',isLoggedIn,async (req,res)=>{
    const {id}= req.params;
    const {title, description, url}=req.body;
    const newLink={
        title,
        description,
        url
    };
    //actualizar de la DB
    await pool.query('UPDATE links set ? WHERE id = ?',[newLink,id]);
    req.flash('success','Link Updated succesfully');
    res.redirect('/links');
});



module.exports= router;