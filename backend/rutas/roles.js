import express from "express";
import { prisma } from "../db/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const roles = await prisma.roles.findMany();
  res.json(roles);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const rol = await prisma.roles.findUnique({
    where: { id: Number(id) },
  });
  res.json(rol);
});

router.post("/", async (req, res) => {
  const { nombre, descripcion } = req.body;

  const nuevoRol = await prisma.roles.create({
    data: {
      nombre,
      descripcion,
    },
  });

  res.json(nuevoRol);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  const rolActualizado = await prisma.roles.update({
    where: { id: Number(id) },
    data: {
      nombre,
      descripcion,
    },
  });

  res.json(rolActualizado);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.roles.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Rol eliminado" });
});

export default router;
