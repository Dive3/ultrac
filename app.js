var express = require("express");
var mongoose = require("mongoose");

var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");

var passport = require("passport");


var routes = require("./routes");
var passportsetup = require("./passportsetup");

var app = express();


mongoose.connect("mongodb://Diana:Veronica3@ds121282.mlab.com:21282/ultracero")
.then(db =>{
   console.log("db is conected")
})
.catch(err=>{
   console.log(err)
})

passportsetup();

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