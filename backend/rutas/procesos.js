import { prisma } from "../lib/prisma.ts";
import { Router } from "express";
import { validarToken } from "../middleware/authMiddleware.js";
import {
  enviarError,
  parseId,
  responderCamposFaltantes,
  responderIdInvalido,
  validarCamposRequeridos,
} from "../utils/http.js";

const procesos = Router();

procesos.use(validarToken);

procesos.get("/obtener/:idproyecto", async (req, res) => {
  try {
    const idproyecto = parseId(req.params.idproyecto);
    if (!idproyecto) return responderIdInvalido(res, "idproyecto");

    const procesos = await prisma.procesos.findMany({
      where: {
        idproyecto,
      },
    });
    return res.status(200).json(procesos);
  } catch (error) {
    return enviarError(res, error, "Error al obtener procesos");
  }
});

procesos.post("/crear", async (req, res) => {
  try {
    const proceso = req.body;
    const camposFaltantes = validarCamposRequeridos(proceso, [
      "nombreProceso",
      "descripcionProceso",
      "idProyecto",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);

    const procesoCreado = await prisma.procesos.create({
      data: {
        nombre: proceso.nombreProceso,
        descripcion: proceso.descripcionProceso,
        idproyecto: Number(proceso.idProyecto),
      },
    });
    return res.status(201).json(procesoCreado);
  } catch (error) {
    return enviarError(res, error, "Error al crear el proceso");
  }
});

procesos.put("/editar/:idproceso", async (req, res) => {
  try {
    const idproceso = parseId(req.params.idproceso);
    if (!idproceso) return responderIdInvalido(res, "idproceso");

    const procesoEditar = req.body;
    const camposFaltantes = validarCamposRequeridos(procesoEditar, [
      "nombreProceso",
      "descripcionProceso",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);

    const procesoEditado = await prisma.procesos.update({
      data: {
        nombre: procesoEditar.nombreProceso,
        descripcion: procesoEditar.descripcionProceso,
      },
      where: {
        idproceso,
      },
    });
    return res.status(200).json(procesoEditado);
  } catch (error) {
    return enviarError(res, error, "Error al editar el proceso");
  }
});

procesos.delete("/eliminar/:idproceso", async (req, res) => {
  try {
    const idproceso = parseId(req.params.idproceso);
    if (!idproceso) return responderIdInvalido(res, "idproceso");

    const procesoEliminado = await prisma.procesos.delete({
      where: {
        idproceso,
      },
    });
    return res.status(200).json(procesoEliminado);
  } catch (error) {
    return enviarError(res, error, "Error al eliminar el proceso");
  }
});

export default procesos;
