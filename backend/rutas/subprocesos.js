import { prisma } from "../lib/prisma";
import { Router } from "express";

const subprocesos = Router();

subprocesos.get("/obtener", async (req, res) => {});

subprocesos.post("/crear", async (req, res) => {
  try {
    const subproceso = req.body;
    const subprocesoCreado = await prisma.subprocesos.create({
      data: {
        nombre: subproceso.nombreSubproceso,
        descripcion: subproceso.descripcion,
        idproceso: subproceso.idProceso,
      },
    });
    return res.status(200).json(subprocesoCreado);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

subprocesos.put("/editar", async (req, res) => {});

subprocesos.delete("/eliminar", async (req, res) => {});

export default subprocesos;
