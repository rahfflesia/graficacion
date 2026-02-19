import express from "express";
import proyectos from "./rutas/proyectos.js";
import tecnicasRecoleccion from "./rutas/tecnicasRecoleccion.js";
import roles from "./rutas/roles.js";
import procesos from "./rutas/procesos.js";
import subprocesos from "./rutas/subprocesos.js";
import cors from "cors";

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
