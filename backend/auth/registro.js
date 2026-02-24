import { Router } from "express";
import { prisma } from "../db/db.js";
import bcrypt from "bcrypt";

const registro = Router();

registro.post("/registrar", async (req, res) => {
  try {
    const datosRegistro = req.body;
    const datosCuenta = await prisma.usuarios.create({
      data: {
        nombre: datosRegistro.nombre,
        hashcontrasena: await bcrypt.hash(datosRegistro.contrasena, 10),
        correo: datosRegistro.correo,
      },
    });

    if (datosCuenta) return res.json(datosCuenta);

    return res.json({ error: "Ha ocurrido un error" });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

export default registro;
