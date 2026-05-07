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
    return res.status(201).json(diagramaCreado);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

diagramas.delete("/eliminar/:iddiagrama", async (req, res) => {
  try {
    const { iddiagrama } = req.params;

    const diagramaEliminado = await prisma.diagramasproyectos.delete({
      where: {
        iddiagrama: parseInt(iddiagrama),
      },
    });

    if (diagramaEliminado)
      return res
        .status(200)
        .json({ mensaje: "Diagrama eliminado correctamente" });
    else
      return res
        .status(404)
        .json({ mensaje: "No se encontró el diagrama a borrar" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

diagramas.put("/editar/:iddiagrama", async (req, res) => {
  try {
    const { iddiagrama } = req.params;
    const datosDiagrama = req.body;
    console.log("Datos del diagrama", datosDiagrama);
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
