var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var SALT_FACTOR = 10;

var usuarioSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    nombre: { type: String },
    apellido_p: { type: String },
    apellido_m: { type: String },
    password: { type: String, required: true },
    role: { type: String }
});

var donothing = () => {

}

usuarioSchema.pre("save",function(done) {
    var usuario = this;
    if(!usuario.isModified("password")){ 
        return done();
    } 
    bcrypt.genSalt(SALT_FACTOR,(err, salt) => {
        if(err){
            return done(err);
        }
        bcrypt.hash(usuario.password, salt, donothing,
        (err, hashedpassword) => {
            if(err){
                return done(err)
            }
            usuario.password = hashedpassword;
            done();
        });
    });
});

usuarioSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
}

usuarioSchema.methods.name = function() {
    return this.username || this.name || this.apellido_p || this.apellido_m;
}

usuarioSchema.methods.usrRole = function(){
    return this.role;
}

usuarioSchema.methods.apellido = function(){
    return this.apellido_p;
}

var Usuario = mongoose.model("Usuario", usuarioSchema);
module.exports = Usuario;