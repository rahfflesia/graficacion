import { prisma } from "../lib/prisma";
import { Router } from "express";
import { validarToken } from "../middleware/authMiddleware";

const subprocesos = Router();

subprocesos.use(validarToken);

subprocesos.get("/obtener/:idsubproceso", async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

subprocesos.post("/crear", async (req, res) => {
  try {
    const datosSubproceso = req.body;

    await prisma.$transaction(async (tx) => {
      const subprocesoCreado = await tx.subprocesos.create({
        data: {
          nombre: datosSubproceso.nombreSubproceso,
          descripcion: datosSubproceso.descripcionSubproceso,
          idproceso: datosSubproceso.idProcesoAsociado,
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

      return res.status(201).json(subprocesoCreadoFormateado);
    });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

subprocesos.put("/editar/:idsubproceso", async (req, res) => {
  try {
    const { idsubproceso } = req.params;
    const datosSubproceso = req.body;
    await prisma.$transaction(async (tx) => {
      const subprocesoEditado = await tx.subprocesos.update({
        data: {
          nombre: datosSubproceso.nombreSubproceso,
          descripcion: datosSubproceso.descripcionSubproceso,
          idproceso: datosSubproceso.idProcesoAsociado,
        },
        where: {
          idsubproceso: parseInt(idsubproceso),
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
        where: { idsubproceso: parseInt(idsubproceso) },
      });

      await tx.metodossubprocesos.createMany({
        data: datosSubproceso.tecnicasSeleccionadas.map((tecnica) => ({
          idsubproceso: parseInt(idsubproceso),
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
      return res.status(200).json(datosSubprocesoEditadoFormateados);
    });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

subprocesos.delete("/eliminar/:idsubproceso", async (req, res) => {
  try {
    const { idsubproceso } = req.params;
    await prisma.$transaction(async (tx) => {
      // Acá elimino las referencias que hay en la tabla de los métodos al subproceso
      await tx.metodossubprocesos.deleteMany({
        where: {
          idsubproceso: parseInt(idsubproceso),
        },
      });

      // En esta elimino el subproceso directamente
      const subprocesoEliminado = await tx.subprocesos.delete({
        where: {
          idsubproceso: parseInt(idsubproceso),
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

      return res.status(200).json(subprocesoEliminadoFormateado);
    });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

export default subprocesos;
