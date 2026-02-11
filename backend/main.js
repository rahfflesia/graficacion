import { prisma } from "./db/db.js";
import rolesRoutes from "./rutas/roles.js";
import stakeholdersRoutes from "./rutas/stakeholders.js";

const express = require("express");
const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  const tecnicasRecoleccion = await prisma.tecnicasrecoleccion.findMany();
  return res.json({ tecnicasRecoleccion });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

app.use(express.json());

app.use("/roles", rolesRoutes);
app.use("/stakeholders", stakeholdersRoutes);