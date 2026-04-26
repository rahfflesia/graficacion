import express from "express";
import { prisma } from "../lib/prisma.ts";

const router = express.Router();

// Crear
router.post("/crear", async (req, res) => {
  const { idsubproceso, idcreador, rolusuario, necesidad, beneficio, criteriosaceptacion, prioridad } = req.body;
  try {
    const historia = await prisma.historiasusuario.create({
      data: { idsubproceso, idcreador, rolusuario, necesidad, beneficio, criteriosaceptacion, prioridad }
    });
    res.json(historia);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener por subproceso
router.get("/obtener/:idsubproceso", async (req, res) => {
  try {
    const historias = await prisma.historiasusuario.findMany({
      where: { idsubproceso: parseInt(req.params.idsubproceso) }
    });
    res.json(historias);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Editar
router.put("/editar/:idhistoriausuario", async (req, res) => {
  const { rolusuario, necesidad, beneficio, criteriosaceptacion, prioridad } = req.body;
  try {
    const historia = await prisma.historiasusuario.update({
      where: { idhistoriausuario: parseInt(req.params.idhistoriausuario) },
      data: { rolusuario, necesidad, beneficio, criteriosaceptacion, prioridad }
    });
    res.json(historia);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Eliminar
router.delete("/eliminar/:idhistoriausuario", async (req, res) => {
  try {
    await prisma.historiasusuario.delete({
      where: { idhistoriausuario: parseInt(req.params.idhistoriausuario) }
    });
    res.json({ mensaje: "Historia eliminada" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;