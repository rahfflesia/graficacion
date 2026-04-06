import { prisma } from "../lib/prisma.ts";
import { Router } from "express";
import { validarToken } from "../middleware/authMiddleware.js";

const observaciones = Router();

observaciones.use(validarToken);

/* idsubproceso: this.subproceso?.idsubproceso!,
      nombre: this.formularioObservaciones.value.nombreObservacion!,
      descripcion: this.formularioObservaciones.value.descripcionObservacion!,
      idpersona: parseInt(this.formularioObservaciones.value.idPersona!),
      lugar: this.formularioObservaciones.value.nombreLugar!,
      tipo: this.tipoObservacionSeleccionada(),
      listaObservados: this.listaParticipantesAgregados,
      fechaHoraCaptura: this.formularioObservaciones.value.fechaHoraCaptura!,*/

observaciones.post("/crear", async (req, res) => {
  try {
    const datosObservacion = req.body;
    await prisma.$transaction(async (tx) => {
      const observacionCreada = await tx.observaciones.create({
        data: datosObservacion,
      });

      if (datosObservacion.listaObservados.length > 0) {
        await tx.observacionesobservados.createMany({
          data: {
            idobservacion: observacionCreada.idobservacion,
            idobservado: datosObservacion.listaObservados.idpersona,
          },
        });
      }

      return res
        .status(200)
        .json({ mensaje: "Observación creada exitosamente" });
    });
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

export default observaciones;
