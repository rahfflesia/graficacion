import express from "express";
import { prisma } from "../db/db.js";
import { validarToken } from "../middleware/authMiddleware.js";

const roles = express.Router();

roles.use(validarToken);

// Obtener todos los roles asociados a un proyecto
roles.get("/obtener/:idproyecto", async (req, res) => {
  try {
    const { idproyecto } = req.params;
    const roles = await prisma.roles.findMany({
      where: {
        idproyecto: parseInt(idproyecto),
      },
    });
    return res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

// Este creo que de momento no lo vamos a utilizar
/*roles.get("/:id", async (req, res) => {
  const { id } = req.params;
  const rol = await prisma.roles.findUnique({
    where: { id: Number(id) },
  });
  res.json(rol);
});*/

roles.post("/crear", async (req, res) => {
  try {
    const datosRol = req.body;
    const nuevoRol = await prisma.roles.create({
      data: {
        nombre: datosRol.nombre,
        tipo: datosRol.tipo,
        idproyecto: datosRol.idproyecto,
      },
    });
    res.status(200).json(nuevoRol);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

roles.put("/editar/:idrol", async (req, res) => {
  try {
    const { idrol } = req.params;
    const datosRol = req.body;
    const rolActualizado = await prisma.roles.update({
      data: {
        nombre: datosRol.nombre,
        tipo: datosRol.tipo,
      },
      where: {
        idrol: parseInt(idrol),
      },
    });
    return res.status(200).json(rolActualizado);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

roles.delete("/eliminar/:idrol", async (req, res) => {
  try {
    const { idrol } = req.params;
    const rolEliminado = await prisma.roles.delete({
      where: {
        idrol: parseInt(idrol),
      },
    });

    if (rolEliminado) return res.status(200).json(rolEliminado);

    return res.status(400).json({ error: "Ha ocurrido un error" });
  } catch (error) {
    console.error(error);
    return res.status(403).json(error);
  }
});

export default roles;
