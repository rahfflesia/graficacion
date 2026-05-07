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

cuestionarios.post("/crear", async (req, res) => {
  try {
    const { idSubproceso, nombre, descripcion, idCreador, preguntas } = req.body;
    const camposFaltantes = validarCamposRequeridos(req.body, [
      "idSubproceso",
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
      const cuestionarioCreado = await tx.cuestionarios.create({
        data: {
          idsubproceso: Number(idSubproceso),
          nombre: nombre,
          descripcion: descripcion,
          idcreador: Number(idCreador),
        },
      });

      if (preguntas && preguntas.length > 0) {
        const datosPreguntas = preguntas.map((pregunta, index) => ({
          idcuestionario: cuestionarioCreado.idicuestionario,
          textopregunta: pregunta.textoPregunta,
          tipopregunta: pregunta.tipoPregunta,
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
    return enviarError(res, error, "Error al crear el cuestionario");
  }
});

cuestionarios.get("/obtener/:idsubproceso", async (req, res) => {
  try {
    const idsubproceso = parseId(req.params.idsubproceso);
    if (!idsubproceso) return responderIdInvalido(res, "idsubproceso");

    const listaCuestionarios = await prisma.cuestionarios.findMany({
      where: { idsubproceso },
      include: { preguntascuestionario: { orderBy: { orden: "asc" } } },
    });
    return res.status(200).json(listaCuestionarios);
  } catch (error) {
    return enviarError(res, error, "Error al obtener cuestionarios");
  }
});

cuestionarios.delete("/eliminar/:idcuestionario", async (req, res) => {
  try {
    const idcuestionario = parseId(req.params.idcuestionario);
    if (!idcuestionario) return responderIdInvalido(res, "idcuestionario");

    const cuestionarioEliminado = await prisma.cuestionarios.delete({
      where: { idicuestionario: idcuestionario },
    });
    return res.status(200).json({
      mensaje: "Cuestionario eliminado",
      cuestionario: cuestionarioEliminado,
    });
  } catch (error) {
    return enviarError(res, error, "Error al eliminar el cuestionario");
  }
});

cuestionarios.put("/editar/:idcuestionario", async (req, res) => {
  try {
    const idcuestionario = parseId(req.params.idcuestionario);
    if (!idcuestionario) return responderIdInvalido(res, "idcuestionario");

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
        where: { idicuestionario: idcuestionario },
        data: {
          nombre,
          descripcion,
          idcreador: Number(idCreador),
        },
      });

      // Eliminar preguntas anteriores
      await tx.preguntascuestionario.deleteMany({
        where: { idcuestionario: idcuestionario },
      });

      // Crear las nuevas preguntas
      if (preguntas && preguntas.length > 0) {
        const datosPreguntas = preguntas.map((pregunta, index) => ({
          idcuestionario: idcuestionario,
          textopregunta: pregunta.textoPregunta,
          tipopregunta: pregunta.tipoPregunta,
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
    return enviarError(res, error, "Error al actualizar el cuestionario");
  }
});

export default cuestionarios;
