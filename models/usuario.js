const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
	nombre: {
		type: String,
		required: [true, "El nombre es obligatorio"],
	},
	correo: {
		type: String,
		required: [true, "El correo es obligatorio"],
		unique: true
	},
	password: {
		type: String,
		required: [true, "La contraseña es obligatoria"],
	},
	img: {
		type: String,
	},
	rol: {
		type: String,
		required: true,
		enum: ["ADMIN_ROLE", "USER_ROLE"],
	},
	estado: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},
});
//DEBE SER UNA FUNCION NORMAL para poder usar el this, si que este referencie al objeto this 
//fuera de la funcion
UsuarioSchema.methods.toJSON = function(){
	// Queremos que en nuestro objeto usuario no aparezca ni la version ni el password
	const { __v, password, ...usuario } = this.toObject();
	return usuario;
};

module.exports = model("Usuario", UsuarioSchema);
