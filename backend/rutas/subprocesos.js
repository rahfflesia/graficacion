import { prisma } from "../lib/prisma";
import { Router } from "express";

const subprocesos = Router();

subprocesos.get("/obtener", async (req, res) => {});

subprocesos.post("/crear", async (req, res) => {});

subprocesos.put("/editar", async (req, res) => {});

subprocesos.delete("/eliminar", async (req, res) => {});

export default subprocesos;
