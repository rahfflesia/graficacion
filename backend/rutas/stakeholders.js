import express from "express";
import { validarToken } from "../middleware/authMiddleware.js";

const stakeholders = express.Router();

stakeholders.use(validarToken);

stakeholders.get("/", (req, res) => {
  res.status(200).json({ message: "Lista de stakeholders" });
});

stakeholders.post("/", (req, res) => {
  res.status(201).json({ message: "Stakeholder creado" });
});

stakeholders.put("/:id", (req, res) => {
  res.status(200).json({ message: "Stakeholder actualizado" });
});

stakeholders.delete("/:id", (req, res) => {
  res.status(200).json({ message: "Stakeholder eliminado" });
});

export default stakeholders;
