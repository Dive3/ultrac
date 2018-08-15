var mongoose = require('mongoose');

var joyaSchema = mongoose.Schema({
    nombre: { type: String, required: true},
    descripcion: { type: String },
    precio: { type: Number },
    cantidad: { type: Number },
});


joyaSchema.methods.name = function() {
    return this.nombre || this.descripcion || this.precio || this.cantidad;
}

var Joya = mongoose.model("Joyas", joyaSchema);
module.exports = Joya;