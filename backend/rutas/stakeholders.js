import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const personas = await prisma.personas.findMany();

  res.json(personas);
});

router.post("/", async (req, res) => {
  const { nombre, apellidouno, apellidodos, correo, telefono } = req.body;

  const persona = await prisma.personas.create({
    data: {
      nombre,
      apellidouno,
      apellidodos,
      correo,
      telefono
    }
  });

  res.json(persona);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.personas.delete({
    where: { idpersona: id }
  });

  res.json({ mensaje: "Persona eliminada" });
});

export default router;
