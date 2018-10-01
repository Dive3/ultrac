var express = require("express");
var mongoose = require("mongoose");

var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");
var multer = require("multer");
var cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dn8smt8jk",
    api_key: "272641451331849",
    apy_secret: "DL8XIDVAlfGPx06gE3mmygNK3DM"
});


var passport = require("passport");

var routes = require("./routes");
var passportsetup = require("./passportsetup");

var app = express();


mongoose.connect("mongodb://Diana:Veronica3@ds121282.mlab.com:21282/ultracero")
//mongoose.connect("mongodb://localhost:27017/ultrac");

passportsetup();

var uploader = multer({dest: "./uploads"});
var middleware_upload = uploader.single('joyas');

app.set("port", process.env.PORT || 3000);

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

var publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));


app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret:"TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize({
    userProperty: "usuario"
}));
app.use(passport.session());

app.use(routes);


app.listen(app.get("port"), () => {
    console.log("La aplicación inició por el puerto "+ app.get("port"));
});