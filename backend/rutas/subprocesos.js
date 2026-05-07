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

const subprocesos = Router();

subprocesos.use(validarToken);

subprocesos.get("/obtener/:idsubproceso", async (req, res) => {
  try {
    const idsubproceso = parseId(req.params.idsubproceso);
    if (!idsubproceso) return responderIdInvalido(res, "idsubproceso");

    const subproceso = await prisma.subprocesos.findUnique({
      where: { idsubproceso },
      include: {
        procesos: { select: { nombre: true, idproceso: true } },
        metodossubprocesos: {
          select: { tecnicasrecoleccion: true },
        },
      },
    });

    if (!subproceso) return res.status(404).json({ error: "Subproceso no encontrado" });

    return res.status(200).json({
      nombreproceso: subproceso.procesos.nombre,
      idproceso: subproceso.procesos.idproceso,
      fechacreacion: subproceso.fechacreacion,
      nombresubproceso: subproceso.nombre,
      descripcionsubproceso: subproceso.descripcion,
      idsubproceso: subproceso.idsubproceso,
      tecnicasasociadas: subproceso.metodossubprocesos.map(
        (metodo) => metodo.tecnicasrecoleccion,
      ),
    });
  } catch (error) {
    return enviarError(res, error, "Error al obtener el subproceso");
  }
});

subprocesos.post("/crear", async (req, res) => {
  try {
    const datosSubproceso = req.body;
    const camposFaltantes = validarCamposRequeridos(datosSubproceso, [
      "nombreSubproceso",
      "descripcionSubproceso",
      "idProcesoAsociado",
      "tecnicasSeleccionadas",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);
    if (!Array.isArray(datosSubproceso.tecnicasSeleccionadas)) {
      return res.status(400).json({ error: "tecnicasSeleccionadas debe ser una lista" });
    }

    const subprocesoCreadoFormateado = await prisma.$transaction(async (tx) => {
      const subprocesoCreado = await tx.subprocesos.create({
        data: {
          nombre: datosSubproceso.nombreSubproceso,
          descripcion: datosSubproceso.descripcionSubproceso,
          idproceso: Number(datosSubproceso.idProcesoAsociado),
        },
        // No me acordaba que se hacía así en prisma
        include: {
          procesos: {
            select: {
              nombre: true,
              idproceso: true,
            },
          },
        },
      });

      const tecnicasSeleccionadas = datosSubproceso.tecnicasSeleccionadas;
      for (const tecnicaSeleccionada of tecnicasSeleccionadas) {
        await tx.metodossubprocesos.create({
          data: {
            idsubproceso: subprocesoCreado.idsubproceso,
            idtecnicarecoleccion: tecnicaSeleccionada.idtecnicarecoleccion,
          },
        });
      }

      const subprocesoCreadoFormateado = {
        nombreproceso: subprocesoCreado.procesos.nombre,
        idproceso: subprocesoCreado.procesos.idproceso,
        fechacreacion: subprocesoCreado.fechacreacion,
        nombresubproceso: subprocesoCreado.nombre,
        descripcionsubproceso: subprocesoCreado.descripcion,
        idsubproceso: subprocesoCreado.idsubproceso,
        tecnicasasociadas: tecnicasSeleccionadas,
      };

      return subprocesoCreadoFormateado;
    });

    return res.status(201).json(subprocesoCreadoFormateado);
  } catch (error) {
    return enviarError(res, error, "Error al crear el subproceso");
  }
});

subprocesos.put("/editar/:idsubproceso", async (req, res) => {
  try {
    const idsubproceso = parseId(req.params.idsubproceso);
    if (!idsubproceso) return responderIdInvalido(res, "idsubproceso");

    const datosSubproceso = req.body;
    const camposFaltantes = validarCamposRequeridos(datosSubproceso, [
      "nombreSubproceso",
      "descripcionSubproceso",
      "idProcesoAsociado",
      "tecnicasSeleccionadas",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);
    if (!Array.isArray(datosSubproceso.tecnicasSeleccionadas)) {
      return res.status(400).json({ error: "tecnicasSeleccionadas debe ser una lista" });
    }

    const datosSubprocesoEditadoFormateados = await prisma.$transaction(async (tx) => {
      const subprocesoEditado = await tx.subprocesos.update({
        data: {
          nombre: datosSubproceso.nombreSubproceso,
          descripcion: datosSubproceso.descripcionSubproceso,
          idproceso: Number(datosSubproceso.idProcesoAsociado),
        },
        where: {
          idsubproceso,
        },
        include: {
          procesos: {
            select: {
              nombre: true,
            },
          },
        },
      });

      await tx.metodossubprocesos.deleteMany({
        where: { idsubproceso },
      });

      await tx.metodossubprocesos.createMany({
        data: datosSubproceso.tecnicasSeleccionadas.map((tecnica) => ({
          idsubproceso,
          idtecnicarecoleccion: tecnica.idtecnicarecoleccion,
        })),
      });

      const datosSubprocesoEditadoFormateados = {
        nombresubproceso: subprocesoEditado.nombre,
        nombreproceso: subprocesoEditado.procesos.nombre,
        descripcionsubproceso: subprocesoEditado.descripcion,
        fechacreacion: subprocesoEditado.fechacreacion,
        idproceso: subprocesoEditado.idproceso,
        idsubproceso: subprocesoEditado.idsubproceso,
        tecnicasasociadas: datosSubproceso.tecnicasSeleccionadas,
      };
      /*nombresubproceso: string;
  nombreproceso: string;
  descripcionsubproceso: string;
  fechacreacion: Date;
  idproceso: number;
  idsubproceso: number;
  tecnicasasociadas: TecnicaRecoleccion[]; */
      return datosSubprocesoEditadoFormateados;
    });

    return res.status(200).json(datosSubprocesoEditadoFormateados);
  } catch (error) {
    return enviarError(res, error, "Error al editar el subproceso");
  }
});

subprocesos.delete("/eliminar/:idsubproceso", async (req, res) => {
  try {
    const idsubproceso = parseId(req.params.idsubproceso);
    if (!idsubproceso) return responderIdInvalido(res, "idsubproceso");

    const subprocesoEliminadoFormateado = await prisma.$transaction(async (tx) => {
      // Acá elimino las referencias que hay en la tabla de los métodos al subproceso
      await tx.metodossubprocesos.deleteMany({
        where: {
          idsubproceso,
        },
      });

      // En esta elimino el subproceso directamente
      const subprocesoEliminado = await tx.subprocesos.delete({
        where: {
          idsubproceso,
        },
        include: {
          procesos: {
            select: {
              nombre: true,
              idproceso: true,
            },
          },
        },
      });

      const subprocesoEliminadoFormateado = {
        nombresubproceso: subprocesoEliminado.nombre,
        nombreproceso: subprocesoEliminado.procesos.nombre,
        fechacreacion: subprocesoEliminado.fechacreacion,
        descripcionsubproceso: subprocesoEliminado.descripcion,
        idproceso: subprocesoEliminado.procesos.idproceso,
        idsubproceso: subprocesoEliminado.idsubproceso,
      };

      return subprocesoEliminadoFormateado;
    });

    return res.status(200).json(subprocesoEliminadoFormateado);
  } catch (error) {
    return enviarError(res, error, "Error al eliminar el subproceso");
  }
});

export default subprocesos;
