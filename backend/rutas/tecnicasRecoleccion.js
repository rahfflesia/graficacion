import { prisma } from "../lib/prisma.ts";
import { Router } from "express";

const tecnicasRecoleccion = Router();

tecnicasRecoleccion.get("/obtener", async (req, res) => {
  try {
    const tecnicas = await prisma.tecnicasrecoleccion.findMany();
    return res.json(tecnicas);
  } catch (error) {
    console.error(error);
  }
});

export default tecnicasRecoleccion;
