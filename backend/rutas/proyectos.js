import { prisma } from "../lib/prisma.ts";
import { Router } from "express";

const proyectos = Router();

// Id del usuario
proyectos.get("/obtenertodos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const proyectosUsuario = await prisma.proyectos.findMany({
      where: {
        idusuario: parseInt(id),
      },
    });

    if (proyectosUsuario) return res.json(proyectosUsuario);

    return res.json([]);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

// Id del proyecto
// Este endpoint está muy desordenado porque no me acordaba que en prisma se usaba 'include', una disculpa
proyectos.get("/obtenerdatos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const datosProyecto = await prisma.proyectos.findUnique({
      where: {
        idproyecto: parseInt(id),
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

    const tecnicasRecoleccion = await prisma.tecnicasrecoleccion.findMany({
      orderBy: {
        idtecnicarecoleccion: "asc",
      },
    });

    const datosFormateadosProyecto = {
      roles: datosProyecto.roles,
      participantes: datosParticipantesFormateados,
      procesos,
      subprocesos,
      tecnicasRecoleccion,
    };
    return res.status(200).json(datosFormateadosProyecto);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

proyectos.post("/crear", async (req, res) => {
  try {
    const proyecto = req.body;
    await prisma.$transaction(async (tx) => {
      const nuevoProyecto = await tx.proyectos.create({
        data: {
          nombre: proyecto.nombre,
          descripcion: proyecto.descripcion,
          idusuario: proyecto.idusuario,
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
      return res.status(201).json(nuevoProyecto);
    });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

proyectos.put("/editar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const proyectoSinActualizar = req.body;
    const proyectoActualizado = await prisma.proyectos.update({
      data: {
        nombre: proyectoSinActualizar.nombre,
        descripcion: proyectoSinActualizar.descripcion,
      },
      where: {
        idproyecto: parseInt(id),
      },
    });
    return res.json(proyectoActualizado);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

proyectos.delete("/eliminar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const proyectoEliminado = await prisma.proyectos.delete({
      where: {
        idproyecto: parseInt(id),
      },
    });

    if (proyectoEliminado) return res.json(proyectoEliminado);

    return res.json({
      error: "No se encontró ningún proyecto asociado a ese id",
    });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

export default proyectos;
