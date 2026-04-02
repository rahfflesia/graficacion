import { Router } from "express";
import { validarToken } from "../middleware/authMiddleware";

const logout = Router();

logout.use(validarToken);

logout.post("/", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ mensaje: "La cookie ha sido eliminada" });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

export default logout;
