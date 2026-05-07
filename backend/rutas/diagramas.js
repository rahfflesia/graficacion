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

const diagramas = Router();

diagramas.use(validarToken);

const TIPOS_DIAGRAMA = ["clase", "secuencia", "paquetes", "casos_uso"];

diagramas.get("/obtener/id/:idproyecto/tipo/:tipo", async (req, res) => {
  try {
    const idproyecto = parseId(req.params.idproyecto);
    if (!idproyecto) return responderIdInvalido(res, "idproyecto");

    const { tipo } = req.params;
    if (!TIPOS_DIAGRAMA.includes(tipo)) {
      return res.status(400).json({ error: "El tipo de diagrama no es válido" });
    }

    const diagrama = await prisma.diagramasproyectos.findUnique({
      where: {
        idproyecto_tipo: {
          idproyecto,
          tipo: tipo,
        },
      },
    });
    return res.status(200).json(diagrama);
  } catch (error) {
    return enviarError(res, error, "Error al obtener el diagrama");
  }
});

diagramas.post("/crear", async (req, res) => {
  try {
    const datosDiagrama = req.body;
    const camposFaltantes = validarCamposRequeridos(datosDiagrama, [
      "idproyecto",
      "nombre",
      "tipo",
      "contenido",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);
    if (!TIPOS_DIAGRAMA.includes(datosDiagrama.tipo)) {
      return res.status(400).json({ error: "El tipo de diagrama no es válido" });
    }

    const diagramaCreado = await prisma.diagramasproyectos.create({
      data: {
        idproyecto: Number(datosDiagrama.idproyecto),
        nombre: datosDiagrama.nombre,
        tipo: datosDiagrama.tipo,
        contenido: datosDiagrama.contenido,
      },
    });
    return res.status(201).json(diagramaCreado);
  } catch (error) {
    return enviarError(res, error, "Error al crear el diagrama");
  }
});

diagramas.delete("/eliminar/:iddiagrama", async (req, res) => {
  try {
    const iddiagrama = parseId(req.params.iddiagrama);
    if (!iddiagrama) return responderIdInvalido(res, "iddiagrama");

    const diagramaEliminado = await prisma.diagramasproyectos.delete({
      where: { iddiagrama },
    });
    return res.status(200).json(diagramaEliminado);
  } catch (error) {
    return enviarError(res, error, "Error al eliminar el diagrama");
  }
});

diagramas.put("/editar/:iddiagrama", async (req, res) => {
  try {
    const iddiagrama = parseId(req.params.iddiagrama);
    if (!iddiagrama) return responderIdInvalido(res, "iddiagrama");

    const datosDiagrama = req.body;
    const camposFaltantes = validarCamposRequeridos(datosDiagrama, ["nombre", "contenido"]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);

    const diagramaActualizado = await prisma.diagramasproyectos.update({
      where: {
        iddiagrama,
      },
      data: {
        nombre: datosDiagrama.nombre,
        contenido: datosDiagrama.contenido,
        ultimaedicion: new Date(),
      },
    });
    return res.status(200).json(diagramaActualizado);
  } catch (error) {
    return enviarError(res, error, "Error al editar el diagrama");
  }
});
import { prisma } from "../lib/prisma.ts";
import { Router } from "express";

const diagramas = Router();

diagramas.get("/obtener/id/:idproyecto/tipo/:tipo", async (req, res) => {
  try {
    const { idproyecto, tipo } = req.params;
    const diagrama = await prisma.diagramasproyectos.findUnique({
      where: {
        idproyecto_tipo: {
          idproyecto: parseInt(idproyecto),
          tipo: tipo,
        },
      },
    });
    return res.status(200).json(diagrama);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

diagramas.post("/crear", async (req, res) => {
  try {
    const datosDiagrama = req.body;
    const diagramaCreado = await prisma.diagramasproyectos.create({
      data: datosDiagrama,
    });
    return res.status(201).json(diagramaCreado);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

diagramas.delete("/eliminar/:iddiagrama", async (req, res) => {
  try {
    const { iddiagrama } = req.params;

    const diagramaEliminado = await prisma.diagramasproyectos.delete({
      where: {
        iddiagrama: parseInt(iddiagrama),
      },
    });

    if (diagramaEliminado)
      return res
        .status(200)
        .json({ mensaje: "Diagrama eliminado correctamente" });
    else
      return res
        .status(404)
        .json({ mensaje: "No se encontró el diagrama a borrar" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

diagramas.put("/editar/:iddiagrama", async (req, res) => {
  try {
    const { iddiagrama } = req.params;
    const datosDiagrama = req.body;
    console.log("Datos del diagrama", datosDiagrama);
    const diagramaActualizado = await prisma.diagramasproyectos.update({
      where: {
        iddiagrama: parseInt(iddiagrama),
      },
      data: datosDiagrama,
    });
    return res.status(200).json(diagramaActualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

export default diagramas;
