const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
	nombre: {
		type: String,
		required: [true, "El nombre es obligatorio"],
        unique: true,
	},
    estado:{
        type: Boolean,
        default: true,
        required: true,        
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    }

});

CategoriaSchema.methods.toJSON = function () {
	// Queremos que en nuestro objeto usuario no aparezca ni la version ni el password
	const { __v, estado, ...data } = this.toObject();	
	return data;
};

module.exports = model("Categoria", CategoriaSchema);
