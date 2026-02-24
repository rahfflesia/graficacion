import { Router } from "express";
import { prisma } from "../db/db";
import bcrypt from "bcrypt";

const login = Router();

login.post("/iniciar-sesion", async (req, res) => {
  try {
    const datosSesion = req.body;
    const datosUsuario = await prisma.usuarios.findUnique({
      where: {
        correo: datosSesion.correo,
      },
    });

    const contrasenaValida = await bcrypt.compare(
      datosSesion.contrasena,
      datosUsuario.hashcontrasena,
    );

    const datosUsuarioFormateados = {
      idusuario: datosUsuario.idusuario,
      nombre: datosUsuario.nombre,
      correo: datosUsuario.correo,
      pfp: datosUsuario.pfp,
    };

    if (contrasenaValida) return res.status(200).json(datosUsuarioFormateados);

    return res.status(404).json({ error: "El usuario no fue encontrado" });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

export default login;
