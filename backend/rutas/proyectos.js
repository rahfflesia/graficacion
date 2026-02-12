import { prisma } from "../lib/prisma.ts";
import { Router } from "express";

const proyectos = Router();

// Id del usuario
proyectos.get("/obtenertodos/:id", async (req, res) => {});

// Id del proyecto
proyectos.get("/obteneruno/:id", async (req, res) => {});

proyectos.post("/crear", async (req, res) => {
  try {
    const proyecto = req.body;
    const nuevoProyecto = await prisma.proyectos.create({
      data: {
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion,
      },
    });
    return res.json(nuevoProyecto);
  } catch (error) {
    console.error(error);
    console.log(error);
    return res.json(error);
  }
});

proyectos.put("/editar/:id", async (req, res) => {});

proyectos.delete("/eliminar/:id", async (req, res) => {});

export default proyectos;
