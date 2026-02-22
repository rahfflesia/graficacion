import express from "express";
const stakeholders = express.Router();

stakeholders.get("/", (req, res) => {
  res.json({ message: "Lista de stakeholders" });
});

stakeholders.post("/", (req, res) => {
  res.json({ message: "Stakeholder creado" });
});

stakeholders.put("/:id", (req, res) => {
  res.json({ message: "Stakeholder actualizado" });
});

stakeholders.delete("/:id", (req, res) => {
  res.json({ message: "Stakeholder eliminado" });
});

export default stakeholders;
