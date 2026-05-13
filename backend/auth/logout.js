import { Router } from "express";
import { validarToken } from "../middleware/authMiddleware.js";
import { enviarError } from "../utils/http.js";

const logout = Router();

logout.use(validarToken);

logout.post("/", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ mensaje: "La cookie ha sido eliminada" });
  } catch (error) {
    return enviarError(res, error, "Error al cerrar sesión");
  }
});

export default logout;
