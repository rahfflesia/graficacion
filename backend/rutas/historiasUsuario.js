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

const router = express.Router();

router.use(validarToken);

// Crear
router.post("/crear", async (req, res) => {
  const { idsubproceso, idcreador, rolusuario, necesidad, beneficio, criteriosaceptacion, prioridad } = req.body;
  try {
    const camposFaltantes = validarCamposRequeridos(req.body, [
      "idsubproceso",
      "idcreador",
      "rolusuario",
      "necesidad",
      "beneficio",
      "criteriosaceptacion",
      "prioridad",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);
    if (!Array.isArray(criteriosaceptacion) || criteriosaceptacion.length < 1) {
      return res.status(400).json({ error: "Debe existir al menos un criterio de aceptación" });
    }

    const historia = await prisma.historiasusuario.create({
      data: {
        idsubproceso: Number(idsubproceso),
        idcreador: Number(idcreador),
        rolusuario,
        necesidad,
        beneficio,
        criteriosaceptacion,
        prioridad,
      }
    });
    return res.status(201).json(historia);
  } catch (e) {
    return enviarError(res, e, "Error al crear la historia de usuario");
  }
});

// Obtener por subproceso
router.get("/obtener/:idsubproceso", async (req, res) => {
  try {
    const idsubproceso = parseId(req.params.idsubproceso);
    if (!idsubproceso) return responderIdInvalido(res, "idsubproceso");

    const historias = await prisma.historiasusuario.findMany({
      where: { idsubproceso }
    });
    return res.status(200).json(historias);
  } catch (e) {
    return enviarError(res, e, "Error al obtener historias de usuario");
  }
});

// Editar
router.put("/editar/:idhistoriausuario", async (req, res) => {
  const { rolusuario, necesidad, beneficio, criteriosaceptacion, prioridad } = req.body;
  try {
    const idhistoriausuario = parseId(req.params.idhistoriausuario);
    if (!idhistoriausuario) return responderIdInvalido(res, "idhistoriausuario");

    const camposFaltantes = validarCamposRequeridos(req.body, [
      "rolusuario",
      "necesidad",
      "beneficio",
      "criteriosaceptacion",
      "prioridad",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);
    if (!Array.isArray(criteriosaceptacion) || criteriosaceptacion.length < 1) {
      return res.status(400).json({ error: "Debe existir al menos un criterio de aceptación" });
    }

    const historia = await prisma.historiasusuario.update({
      where: { idhistoriausuario },
      data: { rolusuario, necesidad, beneficio, criteriosaceptacion, prioridad }
    });
    return res.status(200).json(historia);
  } catch (e) {
    return enviarError(res, e, "Error al editar la historia de usuario");
  }
});

// Eliminar
router.delete("/eliminar/:idhistoriausuario", async (req, res) => {
  try {
    const idhistoriausuario = parseId(req.params.idhistoriausuario);
    if (!idhistoriausuario) return responderIdInvalido(res, "idhistoriausuario");

    const historiaEliminada = await prisma.historiasusuario.delete({
      where: { idhistoriausuario }
    });
    return res.status(200).json(historiaEliminada);
  } catch (e) {
    return enviarError(res, e, "Error al eliminar la historia de usuario");
  }
});

export default router;
