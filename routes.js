var express = require("express");
var Usuario = require("./models/usuario");
var Joya = require("./models/joyas");
var Venta = require("./models/ventas")

var passport = require("passport");
var acl = require("express-acl");

var moment = require('moment');

//IMAGENES
var multer=require("multer");
/*const upload=multer({
    dest:'expedientes/'
});*/
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'joyas/');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
  });
  var upload = multer({storage : storage}).single("image");
var router = express.Router();

//ROLES
acl.config({
    baseUrl:'/',
    defaultRole:'usuario',
    decodedObjectName:'usuario',
    roleSearchPath: 'usuario.role'
  
});

router.use((req, res, next) =>{
    res.locals.currentUsuario = req.usuario;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    if(req.session.passport){
        if(req.usuario){
            req.session.role = req.usuario.role;
        } else {
            req.session.role = "usuario";
        }
    }
    console.log(req.session);
    next();
});

router.use(acl.authorize);

router.get("/", (req, res, next) =>{
    Usuario.find()
        .sort({ createdAt: "descending"})
        .exec((err, usuarios) => {
            if(err){
                return next(err);
            }
            res.render("indexpublic", {usuarios: usuarios});
        });
});

router.get("/usuarios/:username",(req,res,next) =>{
    Usuario.findOne({ username: req.params.username } , (err,usuario) => {
        if(err){
            return next(err);
        }
        if(!usuario){
            return next(404);
        }
        res.render("profile",{ usuario:usuario });
    });
});


//REGISTRAR USUARIO
router.get("/signup", (req, res) =>{
    res.render("signup");
});

router.post("/signup",(req, res, next)=>{
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    var nombre = req.body.nombre;
    var apellido_p = req.body.apellido_p;
    var apellido_m = req.body.apellido_m;

    Usuario.findOne({ username: username}, (err, usuario) =>{
        if(err){
            return next(err);
        }
        if(usuario){
            req.flash("error", "El nombre de usuario ya esta ocupado");
            return res.redirect("/signup");
        }
        var newUsuario = new Usuario({
            username: username,
            password: password,
            role: role,
            nombre: nombre,
            apellido_p: apellido_p,
            apellido_m: apellido_m
        });
        newUsuario.save(next);
        return res.redirect("/");
    });
});


//AGREGAR JOYAS
router.get("/inventariojoyas", (req, res) =>{
    res.render("inventariojoyas");
});

router.post("/inventariojoyas",(req, res, next)=>{
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var precio = req.body.precio;
    var cantidad = req.body.cantidad;

    Joya.findOne({ nombre: nombre }, (err, joya) =>{
        if(err){
            return next(err);
        }
        var newJoya = new Joya({
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            cantidad: cantidad,
    
        });
        newJoya.save(next);
        return res.redirect("/joyas");
    });
});

//INVENTARIO DE JOYAS
router.get("/joyas", (req, res, next) =>{
    Joya.find()
        .exec((err, joyas) => {
            if(err){
                return next(err);
            }
            res.render("joyas", {joyas: joyas});
        });
});


//VENTAS
router.get("/newVenta", (req, res) =>{
    res.render("newVenta");
});

router.post("/newVenta",(req, res, next)=>{
    var cliente = req.body.nombre;
    var producto = req.body.prodcuto;
    var precio = req.body.precio;

    Venta.findOne({ cliente: cliente }, (err, venta) =>{
        if(err){
            return next(err);
        }
        var newVenta = new Venta({
            cliente: cliente,
            producto: producto,
            precio: precio,
        });
        newVenta.save(next);
        return res.redirect("/ventas");
    });
});

router.get("/ventas", (req, res, next) =>{
    Venta.find()
        .exec((err, ventas) => {
            if(err){
                return next(err);
            }
            res.render("ventas", {ventas: ventas});
        });
});


//ENTRAR
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("login",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));


//SALIR
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});


//IMAGENES2
/*router.get("/addExp",(req,res)=>{
    res.sendFile(__dirname+"/expedientes/archivo.txt");
});*/
router.get("/addExp", (req, res) => {
    res.render("addExp");
});


router.post("/addExp",function(req, res) {
    upload(req, res, function(err) {
        if(err){
            return res.redirect("/");
        }});
    });

//PERFIL
router.get("/profile", (req, res) => {
    res.render("profile");
});

    //EDITAR PERFIL
router.get("/edit", ensureAuthenticated,(req,res) => {
    res.render("edit");
});

router.post("/edit", ensureAuthenticated, (req, res, next) => {
    req.usuario.username = req.body.username;
    req.body.nombre = req.body.nombre;
    req.body.apellido_p = req.body.apellido_p;
    req.body.apellido_m = req.body.apellido_m;


    req.usuario.save((err) => {
        if(err){
            next(err);
            return;
        }
        req.flash("info", "Perfil actualizado!");
        res.redirect("/edit");
    });
});


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else{
        req.flash("info", "Necesitas iniciar sesión para poder ver esta sección");
        res.redirect("/login");
    }
}


module.exports = router;