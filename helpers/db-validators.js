const Role = require("../models/rol");
const { Categoria, Producto, Usuario } = require("../models");

/**
 * Usuarios
 */
const esRolValido = async (rol = "") => {
	
	// Verificar si es un rol definido en la BD
	const existeRol = await Role.findOne({ rol });
	if (!existeRol) {
		throw new Error(`El rol ${rol} no está registrado en la BD`);
	}
};

const emailExiste = async (correo = "") => {
	
	// Verificar si el correo ya existe
	const existeEmail = await Usuario.findOne({ correo });
	if (existeEmail) {
		throw new Error(`El correo: ${correo} ya está registrado en la BD`);
	}	
};

const existeUsuarioPorId = async (id = "") => {
	// Verificar si el id es correcto
	const existeUsuario = await Usuario.findById( id );
	if (!existeUsuario) {
		throw new Error(`El id: ${id} no existe`);
	}
}
/*
* Categorias
*/
const existeCategoriaPorId = async (id = "") => {
	// Verificar si el id es correcto
	const existeCategoria = await Categoria.findById(id);
	if (!existeCategoria) {
		throw new Error(`El id: ${id} no existe`);
	}
};

/*
* Productos
*/
const existeProductoPorId = async (id = "") => {
	// Verificar si el id es correcto
	const existeProducto = await Producto.findById(id);
	if (!existeProducto) {
		throw new Error(`El id: ${id} no existe`);
	}
};

/*
* Validar colecciones permitidas
*/
const coleccionesPermitidas = (coleccion='', colecciones = []) => {

	const incluida = colecciones.includes( coleccion );

	if (!incluida) {
		throw new Error(
			`La coleccion ${coleccion} no está permitida [ ${colecciones} ]`,
		);
	}

	return true;
};

module.exports = {
	esRolValido,
	emailExiste,
	existeCategoriaPorId,
	existeProductoPorId,
	existeUsuarioPorId,
	coleccionesPermitidas,
};
