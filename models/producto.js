const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
	nombre: {
		type: String,
		required: [true, "El nombre es obligatorio"],
		unique: true,
	},
	estado: {
		type: Boolean,
		default: true,
		required: true,
	},
	usuario: {
		type: Schema.Types.ObjectId,
		ref: "Usuario",
		required: true,
	},
	precio: {
		type: Number,
		default: 0,
	},
	categoria: {
		type: Schema.Types.ObjectId,
		ref: "Categoria",
		required: true,
	},
	descripcion: {
		type: String,
	},
	disponible: {
		type: Boolean,
		default: true,
	},
	img: {
		type: String,
	},
});

ProductoSchema.methods.toJSON = function () {
	// Queremos que en nuestro objeto usuario no aparezca ni la version ni el password
	const { __v, estado, ...data } = this.toObject();
	return data;
};

module.exports = model("Producto", ProductoSchema);
