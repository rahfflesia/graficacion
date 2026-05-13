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

const respuestasCuestionarios = Router();

respuestasCuestionarios.use(validarToken);

// Guardar respuesta completa de un cuestionario
respuestasCuestionarios.post("/responder", async (req, res) => {
  try {
    const { idCuestionario, idRespondente, respuestas } = req.body;
    const camposFaltantes = validarCamposRequeridos(req.body, [
      "idCuestionario",
      "idRespondente",
      "respuestas",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);
    if (!Array.isArray(respuestas) || respuestas.length < 1) {
      return res.status(400).json({ error: "La respuesta debe incluir al menos una respuesta" });
    }
    // respuestas = [{ idPregunta: number, valor: string }, ...]

    const resultado = await prisma.$transaction(async (tx) => {
      const respuestaCreada = await tx.respuestascuestionario.create({
        data: {
          idcuestionario: Number(idCuestionario),
          idrespondente: Number(idRespondente),
        },
      });

      if (respuestas && respuestas.length > 0) {
        const datosRespuestas = respuestas.map((r) => ({
          idrespuesta: respuestaCreada.idrespuesta,
          idpregunta: r.idPregunta,
          valor: r.valor,
        }));

        await tx.respuestaspreguntas.createMany({
          data: datosRespuestas,
        });
      }

      return respuestaCreada;
    });

    return res.status(201).json({
      mensaje: "Respuesta guardada exitosamente",
      respuesta: resultado,
    });
  } catch (error) {
    return enviarError(res, error, "Error al guardar la respuesta");
  }
});

// Obtener todas las respuestas de un cuestionario
respuestasCuestionarios.get("/obtener/:idcuestionario", async (req, res) => {
  try {
    const idcuestionario = parseId(req.params.idcuestionario);
    if (!idcuestionario) return responderIdInvalido(res, "idcuestionario");

    const respuestas = await prisma.respuestascuestionario.findMany({
      where: { idcuestionario },
      include: {
        personas: true,
        respuestaspreguntas: {
          include: {
            preguntascuestionario: true,
          },
        },
      },
      orderBy: { fecharespuesta: "desc" },
    });
    return res.status(200).json(respuestas);
  } catch (error) {
    return enviarError(res, error, "Error al obtener respuestas");
  }
});

// Eliminar una respuesta
respuestasCuestionarios.delete("/eliminar/:idrespuesta", async (req, res) => {
  try {
    const idrespuesta = parseId(req.params.idrespuesta);
    if (!idrespuesta) return responderIdInvalido(res, "idrespuesta");

    const respuestaEliminada = await prisma.respuestascuestionario.delete({
      where: { idrespuesta },
    });
    return res.status(200).json({
      mensaje: "Respuesta eliminada",
      respuesta: respuestaEliminada,
    });
  } catch (error) {
    return enviarError(res, error, "Error al eliminar la respuesta");
  }
});

export default respuestasCuestionarios;
