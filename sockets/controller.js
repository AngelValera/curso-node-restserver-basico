const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();
/*
 * Al utilizar io en lugar de socket, al emitir un mensaje,
 * este es recibido por todos los clientes
 * que se encuentren escuchando en ese momento
 */
const socketController = async (socket = new Socket(), io) => {
	const usuario = await comprobarJWT(socket.handshake.headers["x-token"]);
	if (!usuario) {
		return socket.disconnect();
	}
	// Agregar el usuario conectado
	chatMensajes.conectarUsuario(usuario);
	io.emit("usuarios-activos", chatMensajes.usuariosArr);
	socket.emit("recibir-mensajes", chatMensajes.ultimos10);

	// Conectar a una sala especial
	socket.join(usuario.id); // salas conectadas: global (io), sala socket.id, usuario.id

	// Eliminar el usuario desconectado
	socket.on("disconnect", () => {
		chatMensajes.desconectarUsuario(usuario.id);
		io.emit("usuarios-activos", chatMensajes.usuariosArr);
	});

	socket.on("enviar-mensaje", ({ mensaje, uid }) => {
		if (uid) {
			// Mensaje privado
			socket.to(uid).emit("mensaje-privado", { de: usuario.nombre, mensaje });
		} else {
			// Mensaje global
			chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
			io.emit("recibir-mensajes", chatMensajes.ultimos10);
		}
	});
};

module.exports = {
	socketController,
};
