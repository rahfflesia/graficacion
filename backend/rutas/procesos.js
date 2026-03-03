import { prisma } from "../lib/prisma.ts";
import { Router } from "express";

const procesos = Router();

procesos.get("/obtener/:idproyecto", async (req, res) => {
  try {
    const { idproyecto } = req.params;
    const procesos = await prisma.procesos.findMany({
      where: {
        idproyecto: parseInt(idproyecto),
      },
    });
    return res.status(200).json(procesos);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

procesos.post("/crear", async (req, res) => {
  try {
    const proceso = req.body;
    const procesoCreado = await prisma.procesos.create({
      data: {
        nombre: proceso.nombreProceso,
        descripcion: proceso.descripcionProceso,
        idproyecto: proceso.idProyecto,
      },
    });
    return res.status(201).json(procesoCreado);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

procesos.put("/editar/:idproceso", async (req, res) => {
  try {
    const { idproceso } = req.params;
    const procesoEditar = req.body;
    const procesoEditado = await prisma.procesos.update({
      data: {
        nombre: procesoEditar.nombreProceso,
        descripcion: procesoEditar.descripcionProceso,
      },
      where: {
        idproceso: parseInt(idproceso),
      },
    });
    return res.status(200).json(procesoEditado);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

procesos.delete("/eliminar/:idproceso", async (req, res) => {
  try {
    const { idproceso } = req.params;
    const procesoEliminado = await prisma.procesos.delete({
      where: {
        idproceso: parseInt(idproceso),
      },
    });
    return res.status(200).json(procesoEliminado);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

export default procesos;
