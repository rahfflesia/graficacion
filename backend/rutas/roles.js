import { prisma } from "../lib/prisma.ts";
import { Router } from "express";

const roles = Router();

roles.get("/obtener", async () => {});

roles.post("/crear", async () => {});

roles.put("/editar", async () => {});

roles.delete("/eliminar", async () => {});

export default roles;
