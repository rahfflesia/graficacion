import { prisma } from "../lib/prisma.ts";
import { Router } from "express";
import { validarToken } from "../middleware/authMiddleware.js";

const cuestionarios = Router();

cuestionarios.use(validarToken);

cuestionarios.post("/crear", async (req, res) => {
  try {
    const { idSubproceso, nombre, descripcion, idCreador, preguntas } = req.body;

    const resultado = await prisma.$transaction(async (tx) => {
      const cuestionarioCreado = await tx.cuestionarios.create({
        data: {
          idsubproceso: idSubproceso,
          nombre: nombre,
          descripcion: descripcion,
          idcreador: idCreador,
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

    return res.status(200).json({
      mensaje: "Cuestionario creado exitosamente",
      cuestionario: resultado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el cuestionario" });
  }
});

cuestionarios.get("/obtener/:idsubproceso", async (req, res) => {
  try {
    const idsubproceso = parseInt(req.params.idsubproceso);
    const listaCuestionarios = await prisma.cuestionarios.findMany({
      where: { idsubproceso },
      include: { preguntascuestionario: { orderBy: { orden: "asc" } } },
    });
    return res.status(200).json(listaCuestionarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener cuestionarios" });
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
    res.status(500).json({ error: "Error al eliminar el cuestionario" });
  }
});

cuestionarios.put("/editar/:idcuestionario", async (req, res) => {
  try {
    const idcuestionario = parseInt(req.params.idcuestionario);
    const { nombre, descripcion, idCreador, preguntas } = req.body;

    const resultado = await prisma.$transaction(async (tx) => {
      const cuestionarioActualizado = await tx.cuestionarios.update({
        where: { idicuestionario: idcuestionario },
        data: {
          nombre,
          descripcion,
          idcreador: idCreador,
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
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el cuestionario" });
  }
});

export default cuestionarios;