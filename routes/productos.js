const { Router } = require("express");
const { check } = require("express-validator");
const {
	actualizarProducto,
	borrarProducto,
	crearProducto,
	obtenerProducto,
	obtenerProductos,
} = require("../controllers/productos");

const {
	existeProductoPorId,
	existeCategoriaPorId,
} = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

router.get("/", obtenerProductos);

router.get(
	"/:id",
	[
		check("id", "No es un ID de Mongo válido").isMongoId(),
		check("id").custom(existeProductoPorId),
		validarCampos,
	],
	obtenerProducto,
);

router.post(
	"/",
	[
		validarJWT,
		check("nombre", "El nombre es obligatorio").not().isEmpty(),
		check("categoria", "La categoría es obligatoria").not().isEmpty(),
		check("categoria", "La categoría no es un ID de Mongo válido").isMongoId(),
		check("categoria").custom(existeCategoriaPorId),
		validarCampos,
	],
	crearProducto,
);

router.put(
	"/:id",
	[
		validarJWT,
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeProductoPorId),
		check("categoria", "La categoría no es un ID de Mongo válido").isMongoId(),
		check("categoria").custom(existeCategoriaPorId),
		validarCampos,
	],
	actualizarProducto,
);

router.delete(
	"/:id",
	[
		validarJWT,
		esAdminRole,
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeProductoPorId),
		validarCampos,
	],
	borrarProducto,
);

module.exports = router;
