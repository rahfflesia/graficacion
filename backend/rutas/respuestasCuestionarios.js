import { prisma } from "../lib/prisma.ts";
import { Router } from "express";
import { validarToken } from "../middleware/authMiddleware.js";

const respuestasCuestionarios = Router();

respuestasCuestionarios.use(validarToken);

// Guardar respuesta completa de un cuestionario
respuestasCuestionarios.post("/responder", async (req, res) => {
  try {
    const { idCuestionario, idRespondente, respuestas } = req.body;
    // respuestas = [{ idPregunta: number, valor: string }, ...]

    const resultado = await prisma.$transaction(async (tx) => {
      const respuestaCreada = await tx.respuestascuestionario.create({
        data: {
          idcuestionario: idCuestionario,
          idrespondente: idRespondente,
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

    return res.status(200).json({
      mensaje: "Respuesta guardada exitosamente",
      respuesta: resultado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar la respuesta" });
  }
});

// Obtener todas las respuestas de un cuestionario
respuestasCuestionarios.get("/obtener/:idcuestionario", async (req, res) => {
  try {
    const idcuestionario = parseInt(req.params.idcuestionario);
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
    console.error(error);
    res.status(500).json({ error: "Error al obtener respuestas" });
  }
});

// Eliminar una respuesta
respuestasCuestionarios.delete("/eliminar/:idrespuesta", async (req, res) => {
  try {
    const idrespuesta = parseInt(req.params.idrespuesta);
    const respuestaEliminada = await prisma.respuestascuestionario.delete({
      where: { idrespuesta },
    });
    return res.status(200).json({
      mensaje: "Respuesta eliminada",
      respuesta: respuestaEliminada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la respuesta" });
  }
});

export default respuestasCuestionarios;