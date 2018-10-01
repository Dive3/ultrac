var express = require("express");
var Usuario = require("./models/usuario");
var Joya = require("./models/joyas");
var Venta = require("./models/ventas")

var passport = require("passport");
var acl = require("express-acl");


var router = express.Router();


// =============================================================================
//                           ROLES
// =============================================================================
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

// =============================================================================
//                           INDEX 
// =============================================================================

router.get("/", (req, res, next) =>{
    Usuario.find()
        .sort({ createdAt: "descending"})
        .exec((err, usuarios) => {
            if(err){
                return next(err);
            }
            res.render("index", {usuarios: usuarios});
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


// =============================================================================
//                           REGISTRAR USUARIOS 
// =============================================================================
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


// =============================================================================
//                           AGREGAR JOYAS
// =============================================================================
router.get("/joyeria", (req, res) =>{
    res.render("joyeria");
});

router.get("/addJoyas", (req, res) =>{
    res.render("addJoyas");
});

router.post("/addJoyas",(req, res, next)=>{
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var precio = req.body.precio;
       
        var newJoya = new Joya({
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            
        });

        newJoya.save(next);
        return res.redirect("/joyas");
});

// =============================================================================
//                           INVENTARIO JOYAS
// =============================================================================

router.get("/joyas", (req, res, next) =>{
    Joya.find()
        .exec((err, joyas) => {
            if(err){
                return next(err);
            }
            res.render("joyas", {joyas: joyas});
        });
});


// =============================================================================
//                           VENTAS
// =============================================================================
router.get("/newVenta", (req, res) =>{
    res.render("newVenta");
});

router.post("/newVenta",(req, res, next)=>{
    var cliente = req.body.cliente;
    var producto = req.body.producto;
    var precio = req.body.precio;

    
        var newVenta = new Venta({
            cliente: cliente,
            pedido: producto,
            precio: precio,
        });
        newVenta.save(next);
        return res.redirect("/ventas");
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


// =============================================================================
//                           INGRESAR
// =============================================================================
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("login",{
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true
}));


// =============================================================================
//                           SALIR 
// =============================================================================
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});


// =============================================================================
//                           PERFIL 
// =============================================================================
router.get("/profile", (req, res) => {
    res.render("profile");
});

// =============================================================================
//                           EDITAR PERFIL 
// =============================================================================
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