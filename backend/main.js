import express from "express";
import proyectos from "./rutas/proyectos";
import tecnicasRecoleccion from "./rutas/tecnicasRecoleccion";
import roles from "./rutas/roles";
import procesos from "./rutas/procesos";
import subprocesos from "./rutas/subprocesos";

const app = express();
const port = 3000;

app.use("/proyectos", proyectos);
app.use("/tecnicasrecoleccion", tecnicasRecoleccion);
app.use("/roles", roles);
app.use("/procesos", procesos);
app.use("/subprocesos", subprocesos);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
