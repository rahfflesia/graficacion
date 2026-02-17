<<<<<<< HEAD
import { prisma } from "./db/db.js";
import rolesRoutes from "./rutas/roles.js";
import stakeholdersRoutes from "./rutas/stakeholders.js";

const express = require("express");
=======
import express from "express";
import proyectos from "./rutas/proyectos";
import tecnicasRecoleccion from "./rutas/tecnicasRecoleccion";
import roles from "./rutas/roles";
import procesos from "./rutas/procesos";
import subprocesos from "./rutas/subprocesos";
import cors from "cors";

>>>>>>> main
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/proyectos", proyectos);
app.use("/tecnicasrecoleccion", tecnicasRecoleccion);
app.use("/roles", roles);
app.use("/procesos", procesos);
app.use("/subprocesos", subprocesos);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

app.use(express.json());

app.use("/roles", rolesRoutes);
app.use("/stakeholders", stakeholdersRoutes);