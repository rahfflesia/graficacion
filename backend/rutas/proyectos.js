import { prisma } from "../lib/prisma.ts";
import { Router } from "express";

const proyectos = Router();

// Id del usuario
proyectos.get("/obtenertodos/:id", async (req, res) => {});

// Id del proyecto
proyectos.get("/obteneruno/:id", async (req, res) => {});

proyectos.post("/crear", async (req, res) => {});

proyectos.put("/editar/:id", async (req, res) => {});

proyectos.delete("/eliminar/:id", async (req, res) => {});

export default proyectos;
