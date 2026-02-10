import { prisma } from "../lib/prisma.ts";
import { Router } from "express";

const procesos = Router();

procesos.get("/obtener", async () => {});

procesos.post("/crear", async () => {});

procesos.put("/editar", async () => {});

procesos.delete("/eliminar", async () => {});

export default procesos;
