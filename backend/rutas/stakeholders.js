import express from "express";
import { prisma } from "../lib/prisma";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const stakeholders = await prisma.stakeholders.findMany({
      orderBy: {
        idstakeholder: "asc"
      }
    });

    res.json(stakeholders);
  } catch (error) {
    console.error("Error al obtener stakeholders:", error);
    res.status(500).json({ error: "Error al obtener stakeholders" });
  }
});

router.get("/proyecto/:idproyecto", async (req, res) => {
  try {
    const idproyecto = parseInt(req.params.idproyecto);

    if (isNaN(idproyecto)) {
      return res.status(400).json({ error: "idproyecto inválido" });
    }

    const stakeholders = await prisma.stakeholders.findMany({
      where: { idproyecto },
      orderBy: {
        idstakeholder: "asc"
      }
    });

    res.json(stakeholders);
  } catch (error) {
    console.error("Error al obtener stakeholders por proyecto:", error);
    res.status(500).json({ error: "Error al obtener stakeholders por proyecto" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const stakeholder = await prisma.stakeholders.findUnique({
      where: { idstakeholder: id }
    });

    if (!stakeholder) {
      return res.status(404).json({ error: "Stakeholder no encontrado" });
    }

    res.json(stakeholder);
  } catch (error) {
    console.error("Error al obtener stakeholder:", error);
    res.status(500).json({ error: "Error al obtener stakeholder" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nombre, influencia, interes, contacto, idproyecto } = req.body;

    if (!nombre || !influencia || !interes || !contacto || !idproyecto) {
      return res.status(400).json({
        error: "nombre, influencia, interes, contacto e idproyecto son obligatorios"
      });
    }

    const proyecto = await prisma.proyectos.findUnique({
      where: { idproyecto: Number(idproyecto) }
    });

    if (!proyecto) {
      return res.status(404).json({ error: "El proyecto no existe" });
    }

    const nuevoStakeholder = await prisma.stakeholders.create({
      data: {
        nombre,
        influencia,
        interes,
        contacto,
        idproyecto: Number(idproyecto)
      }
    });

    res.status(201).json(nuevoStakeholder);
  } catch (error) {
    console.error("Error al crear stakeholder:", error);
    res.status(500).json({ error: "Error al crear stakeholder" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, influencia, interes, contacto, idproyecto } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const stakeholderExistente = await prisma.stakeholders.findUnique({
      where: { idstakeholder: id }
    });

    if (!stakeholderExistente) {
      return res.status(404).json({ error: "Stakeholder no encontrado" });
    }

    if (idproyecto !== undefined) {
      const proyecto = await prisma.proyectos.findUnique({
        where: { idproyecto: Number(idproyecto) }
      });

      if (!proyecto) {
        return res.status(404).json({ error: "El proyecto indicado no existe" });
      }
    }

    const stakeholderActualizado = await prisma.stakeholders.update({
      where: { idstakeholder: id },
      data: {
        nombre,
        influencia,
        interes,
        contacto,
        idproyecto: idproyecto !== undefined ? Number(idproyecto) : undefined
      }
    });

    res.json(stakeholderActualizado);
  } catch (error) {
    console.error("Error al actualizar stakeholder:", error);
    res.status(500).json({ error: "Error al actualizar stakeholder" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const stakeholderExistente = await prisma.stakeholders.findUnique({
      where: { idstakeholder: id }
    });

    if (!stakeholderExistente) {
      return res.status(404).json({ error: "Stakeholder no encontrado" });
    }

    await prisma.stakeholders.delete({
      where: { idstakeholder: id }
    });

    res.json({ mensaje: "Stakeholder eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar stakeholder:", error);
    res.status(500).json({ error: "Error al eliminar stakeholder" });
  }
});

export default router;