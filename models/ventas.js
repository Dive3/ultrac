var mongoose = require('mongoose');

var ventaSchema = mongoose.Schema({
    cliente: { type: String, required: true},
    pedido: { type: String },
    precio: { type: Number },
});


ventaSchema.methods.name = function() {
    return this.cliente || this.pedido || this.precio;
}

var Venta = mongoose.model("Ventas", ventaSchema);
module.exports = Venta;