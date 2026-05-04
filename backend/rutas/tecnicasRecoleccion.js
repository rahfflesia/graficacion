import { prisma } from "../lib/prisma.ts";
import { Router } from "express";
import { validarToken } from "../middleware/authMiddleware.js";

const tecnicasRecoleccion = Router();

const tecnicasPorDefecto = [
  { nombre: "Entrevista", descripcion: "Recolección mediante entrevistas" },
  { nombre: "Observacion", descripcion: "Recolección mediante observación directa" },
  { nombre: "Cuestionario", descripcion: "Recolección mediante cuestionarios" },
  {
    nombre: "Historia de usuario",
    descripcion: "Recolección mediante historias de usuario",
  },
  { nombre: "Focus group", descripcion: "Recolección mediante grupos focales" },
  {
    nombre: "Análisis de documento",
    descripcion: "Recolección mediante análisis documental",
  },
];

tecnicasRecoleccion.use(validarToken);

tecnicasRecoleccion.get("/obtener", async (req, res) => {
  try {
    let tecnicas = await prisma.tecnicasrecoleccion.findMany({
      orderBy: {
        idtecnicarecoleccion: "asc",
      },
    });

    if (tecnicas.length === 0) {
      await prisma.tecnicasrecoleccion.createMany({
        data: tecnicasPorDefecto,
      });

      tecnicas = await prisma.tecnicasrecoleccion.findMany({
        orderBy: {
          idtecnicarecoleccion: "asc",
        },
      });
    }

    return res.json(tecnicas);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

export default tecnicasRecoleccion;
