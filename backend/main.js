import express from "express";
import proyectos from "./rutas/proyectos";
import tecnicasRecoleccion from "./rutas/tecnicasRecoleccion";
import roles from "./rutas/roles";
import procesos from "./rutas/procesos";
import subprocesos from "./rutas/subprocesos";
import cors from "cors";
import stakeholders from "./rutas/stakeholders";
import registro from "./auth/registro";
import login from "./auth/login";
import participantes from "./rutas/participantes";
import logout from "./auth/logout";
import cookieParser from "cookie-parser";
import observaciones from "./rutas/observaciones";
import cuestionarios from "./rutas/cuestionarios";
import respuestasCuestionarios from "./rutas/respuestasCuestionarios";
import entrevistas from "./rutas/entrevistas";

const app = express();
const port = 3000;

app.use(cors({ credentials: true, origin: "http://localhost:4200" }));
app.use(express.json());
app.use(cookieParser());

app.use("/proyectos", proyectos);
app.use("/tecnicasrecoleccion", tecnicasRecoleccion);
app.use("/roles", roles);
app.use("/procesos", procesos);
app.use("/subprocesos", subprocesos);
app.use("/stakeholders", stakeholders);
app.use("/registro", registro);
app.use("/login", login);
app.use("/participantes", participantes);
app.use("/logout", logout);
app.use("/observaciones", observaciones);
app.use("/cuestionarios", cuestionarios);
app.use("/respuestas-cuestionarios", respuestasCuestionarios);
app.use("/entrevistas", entrevistas);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
