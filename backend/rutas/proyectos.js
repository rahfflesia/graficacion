import { prisma } from "../lib/prisma.ts";
import { Router } from "express";
import { validarToken } from "../middleware/authMiddleware.js";
import {
  enviarError,
  parseId,
  responderCamposFaltantes,
  responderIdInvalido,
  validarCamposRequeridos,
} from "../utils/http.js";

const proyectos = Router();

const tecnicasPorDefecto = [
  { nombre: "Entrevista", descripcion: "Recolección mediante entrevistas" },
  {
    nombre: "Observacion",
    descripcion: "Recolección mediante observación directa",
  },
  { nombre: "Cuestionario", descripcion: "Recolección mediante cuestionarios" },
  {
    nombre: "Historia de usuario",
    descripcion: "Recolección mediante historias de usuario",
  },
  { nombre: "Focus group", descripcion: "Recolección mediante grupos focales" },
  {
    nombre: "Análisis de documento",
    descripcion: "Recolección mediante análisis documental",
  },
];

async function obtenerTecnicasRecoleccion() {
  let tecnicasRecoleccion = await prisma.tecnicasrecoleccion.findMany({
    orderBy: {
      idtecnicarecoleccion: "asc",
    },
  });

  if (tecnicasRecoleccion.length > 0) return tecnicasRecoleccion;

  await prisma.tecnicasrecoleccion.createMany({
    data: tecnicasPorDefecto,
  });

  return prisma.tecnicasrecoleccion.findMany({
    orderBy: {
      idtecnicarecoleccion: "asc",
    },
  });
}

// Middleware de autenticación para proteger la ruta
proyectos.use(validarToken);

// Id del usuario
proyectos.get("/obtenertodos/:id", async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return responderIdInvalido(res, "id");

    const proyectosUsuario = await prisma.proyectos.findMany({
      where: {
        idusuario: id,
      },
    });

    return res.status(200).json(proyectosUsuario);
  } catch (error) {
    return enviarError(res, error, "Error al obtener los proyectos");
  }
});

// Id del proyecto
// Este endpoint está muy desordenado porque no me acordaba que en prisma se usaba 'include', una disculpa
proyectos.get("/obtenerdatos/:id", async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return responderIdInvalido(res, "id");

    const datosProyecto = await prisma.proyectos.findUnique({
      where: {
        idproyecto: id,
      },
      select: {
        procesos: {
          select: {
            subprocesos: {
              select: {
                nombre: true,
                idproceso: true,
                idsubproceso: true,
                descripcion: true,
                fechacreacion: true,
                metodossubprocesos: {
                  select: {
                    tecnicasrecoleccion: {
                      select: {
                        idtecnicarecoleccion: true,
                        nombre: true,
                        descripcion: true,
                      },
                    },
                  },
                },
              },
            },
            nombre: true,
            fechacreacion: true,
            idproceso: true,
            descripcion: true,
          },
        },
        roles: true,
        rolespersonasproyecto: {
          select: {
            personas: true,
            roles: true,
            idrolpersonaproyecto: true,
            idrol: true,
          },
        },
      },
    });

    if (!datosProyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    let subprocesos = [];
    for (let i = 0; i < datosProyecto.procesos.length; i++) {
      for (let j = 0; j < datosProyecto.procesos[i].subprocesos.length; j++) {
        const datosProceso = datosProyecto.procesos[i];
        const datosSubproceso = datosProyecto.procesos[i].subprocesos[j];
        let nuevoSubproceso = {
          nombreproceso: datosProceso.nombre,
          nombresubproceso: datosSubproceso.nombre,
          descripcionsubproceso: datosSubproceso.descripcion,
          fechacreacion: datosSubproceso.fechacreacion,
          idproceso: datosSubproceso.idproceso,
          idsubproceso: datosSubproceso.idsubproceso,
          // Necesito las tecnicas asociadas para mostrar en la ui, otra para comparar cuando vaya a editar el subproceso
          // y seleccionar las que tenía asociadas anteriormente el subproceso
          tecnicasasociadas: datosSubproceso.metodossubprocesos.map(
            (tecnicaRecoleccion) => tecnicaRecoleccion.tecnicasrecoleccion,
          ),
        };
        subprocesos.push(nuevoSubproceso);
      }
    }

    let procesos = [];
    for (let i = 0; i < datosProyecto.procesos.length; i++) {
      const procesoAntiguo = datosProyecto.procesos[i];
      let nuevoProceso = {
        idproyecto: parseInt(id),
        nombre: procesoAntiguo.nombre,
        descripcion: procesoAntiguo.descripcion,
        idproceso: procesoAntiguo.idproceso,
        fechacreacion: procesoAntiguo.fechacreacion,
      };
      procesos.push(nuevoProceso);
    }

    const datosParticipantesFormateados =
      datosProyecto.rolespersonasproyecto.map(function (objeto) {
        return {
          ...objeto.personas,
          nombrerol: objeto.roles.nombre,
          idrolpersonaproyecto: objeto.idrolpersonaproyecto,
          idrol: objeto.idrol,
        };
      });

    const tecnicasRecoleccion = await obtenerTecnicasRecoleccion();

    const datosFormateadosProyecto = {
      roles: datosProyecto.roles,
      participantes: datosParticipantesFormateados,
      procesos,
      subprocesos,
      tecnicasRecoleccion,
    };
    return res.status(200).json(datosFormateadosProyecto);
  } catch (error) {
    return enviarError(res, error, "Error al obtener los datos del proyecto");
  }
});

proyectos.post("/crear", async (req, res) => {
  try {
    const proyecto = req.body;
    const camposFaltantes = validarCamposRequeridos(proyecto, [
      "nombre",
      "descripcion",
      "idusuario",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);

    const nuevoProyecto = await prisma.$transaction(async (tx) => {
      const nuevoProyecto = await tx.proyectos.create({
        data: {
          nombre: proyecto.nombre,
          descripcion: proyecto.descripcion,
          idusuario: Number(proyecto.idusuario),
          estado: "Activo",
        },
      });
      const idProyecto = nuevoProyecto.idproyecto;
      const rolesPorDefecto = [
        {
          nombre: "Product owner",
          tipo: "Externo",
          idproyecto: idProyecto,
        },
        { nombre: "Tech lead", tipo: "Interno", idproyecto: idProyecto },
      ];
      await tx.roles.createMany({
        data: rolesPorDefecto,
      });
      return nuevoProyecto;
    });

    return res.status(201).json(nuevoProyecto);
  } catch (error) {
    return enviarError(res, error, "Error al crear el proyecto");
  }
});

proyectos.put("/editar/:id", async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return responderIdInvalido(res, "id");

    const proyectoSinActualizar = req.body;
    const camposFaltantes = validarCamposRequeridos(proyectoSinActualizar, [
      "nombre",
      "descripcion",
      "estado",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);
    if (!["Activo", "Pausado", "Cancelado", "En_revisi_n"].includes(proyectoSinActualizar.estado)) {
      return res.status(400).json({ error: "El estado del proyecto no es válido" });
    }

    const proyectoActualizado = await prisma.proyectos.update({
      data: {
        nombre: proyectoSinActualizar.nombre,
        descripcion: proyectoSinActualizar.descripcion,
        estado: proyectoSinActualizar.estado,
      },
      where: {
        idproyecto: id,
      },
    });
    return res.json(proyectoActualizado);
  } catch (error) {
    return enviarError(res, error, "Error al editar el proyecto");
  }
});

proyectos.delete("/eliminar/:id", async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return responderIdInvalido(res, "id");

    const proyectoEliminado = await prisma.proyectos.delete({
      where: {
        idproyecto: id,
      },
    });

    return res.status(200).json(proyectoEliminado);
  } catch (error) {
    return enviarError(res, error, "Error al eliminar el proyecto");
  }
});

proyectos.get("/obtenerdatosproyecto/:idproyecto", async (req, res) => {
  try {
    const { idproyecto } = req.params;
    const datosProyecto = await prisma.proyectos.findUnique({
      where: {
        idproyecto: parseInt(idproyecto),
      },
    });
    return res.status(200).json(datosProyecto);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

export default proyectos;
