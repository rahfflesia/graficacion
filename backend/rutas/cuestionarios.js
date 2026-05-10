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

const cuestionarios = Router();

cuestionarios.use(validarToken);

const mapaTiposPregunta = {
  Abierta: "Abierta",
  Escala: "Escala",
  "Opción múltiple": "Opcion_multiple",
};

cuestionarios.post("/crear", async (req, res) => {
  try {
    const { idSubproceso, nombre, descripcion, idCreador, preguntas } =
      req.body;

    const resultado = await prisma.$transaction(async (tx) => {
      const cuestionarioCreado = await tx.cuestionarios.create({
        data: {
          idsubproceso: idSubproceso,
          nombre,
          descripcion,
          idcreador: idCreador,
        },
      });

      if (preguntas && preguntas.length > 0) {
        const datosPreguntas = preguntas.map((pregunta, index) => ({
          idcuestionario: cuestionarioCreado.idicuestionario,
          textopregunta: pregunta.textoPregunta,
          tipopregunta: mapaTiposPregunta[pregunta.tipoPregunta] || "Abierta",
          opciones: pregunta.opciones || [],
          orden: index + 1,
        }));

        await tx.preguntascuestionario.createMany({
          data: datosPreguntas,
        });
      }

      return cuestionarioCreado;
    });

    return res.status(201).json({
      mensaje: "Cuestionario creado exitosamente",
      cuestionario: resultado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error al crear el cuestionario",
    });
  }
});

cuestionarios.get("/obtener/:idsubproceso", async (req, res) => {
  try {
    const idsubproceso = parseInt(req.params.idsubproceso);

    const listaCuestionarios = await prisma.cuestionarios.findMany({
      where: { idsubproceso },
      include: {
        preguntascuestionario: {
          orderBy: { orden: "asc" },
        },
      },
    });

    return res.status(200).json(listaCuestionarios);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error al obtener cuestionarios",
    });
  }
});

cuestionarios.delete("/eliminar/:idcuestionario", async (req, res) => {
  try {
    const idcuestionario = parseInt(req.params.idcuestionario);

    const cuestionarioEliminado = await prisma.cuestionarios.delete({
      where: { idicuestionario: idcuestionario },
    });

    return res.status(200).json({
      mensaje: "Cuestionario eliminado",
      cuestionario: cuestionarioEliminado,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error al eliminar el cuestionario",
    });
  }
});

cuestionarios.put("/editar/:idcuestionario", async (req, res) => {
  try {
    const idcuestionario = parseInt(req.params.idcuestionario);

    const { nombre, descripcion, idCreador, preguntas } = req.body;
    const camposFaltantes = validarCamposRequeridos(req.body, [
      "nombre",
      "descripcion",
      "idCreador",
      "preguntas",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);
    if (!Array.isArray(preguntas) || preguntas.length < 1) {
      return res.status(400).json({ error: "El cuestionario debe tener al menos una pregunta" });
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const cuestionarioActualizado = await tx.cuestionarios.update({
        where: {
          idicuestionario: idcuestionario,
        },
        data: {
          nombre,
          descripcion,
          idcreador: Number(idCreador),
        },
      });

      // Eliminar preguntas anteriores
      await tx.preguntascuestionario.deleteMany({
        where: {
          idcuestionario: idcuestionario,
        },
      });

      // Crear nuevas preguntas
      if (preguntas && preguntas.length > 0) {
        const datosPreguntas = preguntas.map((pregunta, index) => ({
          idcuestionario: idcuestionario,
          textopregunta: pregunta.textoPregunta,
          tipopregunta: mapaTiposPregunta[pregunta.tipoPregunta] || "Abierta",
          opciones: pregunta.opciones || [],
          orden: index + 1,
        }));

        await tx.preguntascuestionario.createMany({
          data: datosPreguntas,
        });
      }

      return cuestionarioActualizado;
    });

    return res.status(200).json({
      mensaje: "Cuestionario actualizado exitosamente",
      cuestionario: resultado,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error al actualizar el cuestionario",
    });
  }
});

export default cuestionarios;
