var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var SALT_FACTOR = 10;

var clienteSchema = mongoose.Schema({
    nombre: { type: String },
    cantidad: { type: Number},
    fecha: { type: Date, default: Date.now }
});

var donothing = () => {

}


clienteSchema.methods.nomb = function() {
    return this.name;
}

clienteSchema.methods.date = function(){
    return this.fecha;
}


var Cliente = mongoose.model("Clientes", clienteSchema);
module.exports = Cliente;