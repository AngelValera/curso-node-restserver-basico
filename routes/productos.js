const { Router } = require("express");
const { check } = require("express-validator");
const {
	actualizarProducto,
	borrarProducto,
	crearProducto,
	obtenerProducto,
	obtenerProductos,
} = require("../controllers/productos");

const { existeProductoPorId, existeCategoriaPorNombre } = require("../helpers/db-validators");
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
        check("categoria").custom(existeCategoriaPorNombre),
		validarCampos,
	],
	crearProducto,
);

router.put(
	"/:id",
	[
		validarJWT,
		check("nombre", "El nombre es obligatorio").not().isEmpty(),
		check("categoria", "La categoría es obligatoria").not().isEmpty(),
		check("categoria").custom(existeCategoriaPorNombre),
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeProductoPorId),
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
