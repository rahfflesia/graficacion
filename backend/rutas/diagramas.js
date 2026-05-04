import { error } from "node:console";
import { prisma } from "../lib/prisma.ts";
import { Router } from "express";

const diagramas = Router();

diagramas.get("/obtener/id/:idproyecto/tipo/:tipo", async (req, res) => {
  try {
    const { idproyecto, tipo } = req.params;
    const diagrama = await prisma.diagramasproyectos.findUnique({
      where: {
        idproyecto_tipo: {
          idproyecto: parseInt(idproyecto),
          tipo: tipo,
        },
      },
    });
    return res.status(200).json(diagrama);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

diagramas.post("/crear", async (req, res) => {
  try {
    const datosDiagrama = req.body;
    const diagramaCreado = await prisma.diagramasproyectos.create({
      data: datosDiagrama,
    });
    return res.status(201).json(datosDiagrama);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

diagramas.delete("/eliminar/:iddiagrama", async () => {});

diagramas.put("/editar/:iddiagrama", async (req, res) => {
  try {
    const { iddiagrama } = req.params;
    const datosDiagrama = req.body;
    const diagramaActualizado = await prisma.diagramasproyectos.update({
      where: {
        iddiagrama: parseInt(iddiagrama),
      },
      data: datosDiagrama,
    });
    return res.status(200).json(diagramaActualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

export default diagramas;
