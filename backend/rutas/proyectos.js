import { prisma } from "../lib/prisma.ts";
import { Router } from "express";

const proyectos = Router();

// Id del usuario
proyectos.get("/obtenertodos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const proyectosUsuario = await prisma.proyectos.findMany({
      where: {
        idusuario: parseInt(id),
      },
    });

    if (proyectosUsuario) return res.json(proyectosUsuario);

    return res.json([]);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

// Id del proyecto
proyectos.get("/obteneruno/:id", async (req, res) => {});

proyectos.post("/crear", async (req, res) => {
  try {
    const proyecto = req.body;
    const nuevoProyecto = await prisma.proyectos.create({
      data: {
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion,
        idusuario: proyecto.idUsuario,
      },
    });

    if (nuevoProyecto) return res.json(nuevoProyecto);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

proyectos.put("/editar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const proyectoSinActualizar = req.body;
    const proyectoActualizado = await prisma.proyectos.update({
      data: {
        nombre: proyectoSinActualizar.nombre,
        descripcion: proyectoSinActualizar.descripcion,
      },
      where: {
        idproyecto: parseInt(id),
      },
    });
    return res.json(proyectoActualizado);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

proyectos.delete("/eliminar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const proyectoEliminado = await prisma.proyectos.delete({
      where: {
        idproyecto: parseInt(id),
      },
    });

    if (proyectoEliminado) return res.json(proyectoEliminado);

    return res.json({
      error: "No se encontró ningún proyecto asociado a ese id",
    });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

export default proyectos;
