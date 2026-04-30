import { Router } from "express";
import { prisma } from "../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = Router();

login.post("/iniciar-sesion", async (req, res) => {
  try {
    const datosSesion = req.body;

    const datosUsuario = await prisma.usuarios.findUnique({
      where: {
        correo: datosSesion.correo,
      },
    });

    if (!datosUsuario) {
      return res.status(404).json({ error: "El usuario no fue encontrado" });
    }

    const contrasenaValida = await bcrypt.compare(
      datosSesion.contrasena,
      datosUsuario.hashcontrasena,
    );

    if (!contrasenaValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const datosUsuarioFormateados = {
      idusuario: datosUsuario.idusuario,
      nombre: datosUsuario.nombre,
      correo: datosUsuario.correo,
      pfp: datosUsuario.pfp,
    };

    const token = jwt.sign(datosUsuarioFormateados, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      token,
      usuario: datosUsuarioFormateados,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error interno del servidor",
      detalle: error.message,
    });
  }
});

export default login;
