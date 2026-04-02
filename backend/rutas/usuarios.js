import { prisma } from "../lib/prisma";
import { Router } from "express";
import { validarToken } from "../middleware/authMiddleware";

const usuarios = Router();

usuarios.use(validarToken);

export default usuarios;
