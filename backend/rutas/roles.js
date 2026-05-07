import express from "express";
import { prisma } from "../lib/prisma.ts";
import { validarToken } from "../middleware/authMiddleware.js";
import {
  enviarError,
  parseId,
  responderCamposFaltantes,
  responderIdInvalido,
  validarCamposRequeridos,
} from "../utils/http.js";

const roles = express.Router();

roles.use(validarToken);

// Obtener todos los roles asociados a un proyecto
roles.get("/obtener/:idproyecto", async (req, res) => {
  try {
    const idproyecto = parseId(req.params.idproyecto);
    if (!idproyecto) return responderIdInvalido(res, "idproyecto");

    const roles = await prisma.roles.findMany({
      where: {
        idproyecto,
      },
    });
    return res.status(200).json(roles);
  } catch (error) {
    return enviarError(res, error, "Error al obtener roles");
  }
});

// Este creo que de momento no lo vamos a utilizar
/*roles.get("/:id", async (req, res) => {
  const { id } = req.params;
  const rol = await prisma.roles.findUnique({
    where: { id: Number(id) },
  });
  res.json(rol);
});*/

roles.post("/crear", async (req, res) => {
  try {
    const datosRol = req.body;
    const camposFaltantes = validarCamposRequeridos(datosRol, ["nombre", "tipo", "idproyecto"]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);
    if (!["Interno", "Externo"].includes(datosRol.tipo)) {
      return res.status(400).json({ error: "El tipo de rol no es válido" });
    }

    const nuevoRol = await prisma.roles.create({
      data: {
        nombre: datosRol.nombre,
        tipo: datosRol.tipo,
        idproyecto: Number(datosRol.idproyecto),
      },
    });
    return res.status(201).json(nuevoRol);
  } catch (error) {
    return enviarError(res, error, "Error al crear el rol");
  }
});

roles.put("/editar/:idrol", async (req, res) => {
  try {
    const idrol = parseId(req.params.idrol);
    if (!idrol) return responderIdInvalido(res, "idrol");

    const datosRol = req.body;
    const camposFaltantes = validarCamposRequeridos(datosRol, ["nombre", "tipo"]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);
    if (!["Interno", "Externo"].includes(datosRol.tipo)) {
      return res.status(400).json({ error: "El tipo de rol no es válido" });
    }

    const rolActualizado = await prisma.roles.update({
      data: {
        nombre: datosRol.nombre,
        tipo: datosRol.tipo,
      },
      where: {
        idrol,
      },
    });
    return res.status(200).json(rolActualizado);
  } catch (error) {
    return enviarError(res, error, "Error al editar el rol");
  }
});

roles.delete("/eliminar/:idrol", async (req, res) => {
  try {
    const idrol = parseId(req.params.idrol);
    if (!idrol) return responderIdInvalido(res, "idrol");

    const rolEliminado = await prisma.roles.delete({
      where: {
        idrol,
      },
    });

    return res.status(200).json(rolEliminado);
  } catch (error) {
    return enviarError(res, error, "Error al eliminar el rol");
  }
});

export default roles;
