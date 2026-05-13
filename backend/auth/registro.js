import { Router } from "express";
import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcrypt";
import {
  enviarError,
  responderCamposFaltantes,
  validarCamposRequeridos,
} from "../utils/http.js";

const registro = Router();

registro.post("/registrar", async (req, res) => {
  try {
    const datosRegistro = req.body;
    const camposFaltantes = validarCamposRequeridos(datosRegistro, [
      "nombre",
      "correo",
      "contrasena",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);

    const datosCuenta = await prisma.usuarios.create({
      data: {
        nombre: datosRegistro.nombre,
        hashcontrasena: await bcrypt.hash(datosRegistro.contrasena, 10),
        correo: datosRegistro.correo,
      },
    });

    return res.status(201).json(datosCuenta);
  } catch (error) {
    return enviarError(res, error, "Error al registrar el usuario");
  }
});

export default registro;
