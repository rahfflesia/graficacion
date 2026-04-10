import { prisma } from "../lib/prisma.ts";
import { Router } from "express";
import { validarToken } from "../middleware/authMiddleware.js";

const observaciones = Router();

observaciones.use(validarToken);

observaciones.post("/crear", async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      idobservador,
      lugar,
      fechahoracaptura,
      listaobservados,
      tipo,
      idsubproceso,
    } = req.body;
    await prisma.$transaction(async (tx) => {
      // Quizás haya una mejor manera de hacerlo, pero esta fue la que se me ocurrió
      const datosObservacion = fechahoracaptura
        ? {
            nombre,
            descripcion,
            idobservador,
            lugar,
            tipo,
            idsubproceso,
            fechahoracaptura,
          }
        : {
            nombre,
            descripcion,
            idobservador,
            lugar,
            tipo,
            idsubproceso,
          };
      const observacionCreada = await tx.observaciones.create({
        data: datosObservacion,
      });

      if (listaobservados.length > 0) {
        const arrayDatosObservados = listaobservados.map((observado) => {
          return {
            idobservacion: observacionCreada.idobservacion,
            idobservado: observado.idpersona,
          };
        });
        await tx.observacionesobservados.createMany({
          data: arrayDatosObservados,
        });
      }

      const observacion = await tx.observaciones.findUnique({
        where: {
          idobservacion: observacionCreada.idobservacion,
        },
      });

      return res.status(200).json(observacion);
    });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

observaciones.get("/obtener/:idsubproceso", async (req, res) => {
  try {
    const { idsubproceso } = req.params;

    const observacionesSubproceso = await prisma.observaciones.findMany({
      where: {
        idsubproceso: parseInt(idsubproceso),
      },
    });

    const observacionesSubprocesoFormateados = await Promise.all(
      observacionesSubproceso.map(async (observacion) => {
        const idObservacion = observacion.idobservacion;

        const observadosRel = await prisma.observacionesobservados.findMany({
          where: {
            idobservacion: idObservacion,
          },
          select: {
            idobservado: true,
          },
        });

        const datosObservador = await prisma.personas.findUnique({
          where: {
            idpersona: observacion.idobservador,
          },
        });

        const idsObservados = observadosRel.map((o) => o.idobservado);

        if (idsObservados.length === 0) {
          return {
            ...observacion,
            observador: datosObservador,
            listaparticipantes: [],
          };
        }

        const datosObservados = await Promise.all(
          idsObservados.map(async (idObservado) => {
            const participante = await prisma.personas.findUnique({
              where: {
                idpersona: idObservado,
              },
              include: {
                rolespersonasproyecto: true,
              },
            });

            const rolPersona = participante.rolespersonasproyecto[0];

            if (!rolPersona) return participante;

            const rolData = await prisma.rolespersonasproyecto.findUnique({
              where: {
                idrolpersonaproyecto: rolPersona.idrolpersonaproyecto,
              },
              include: {
                roles: {
                  select: {
                    nombre: true,
                  },
                },
              },
            });

            return {
              ...participante,
              idrolpersonaproyecto: rolData.idrolpersonaproyecto,
              idrol: rolData?.idrol,
              nombrerol: rolData?.roles?.nombre,
              tiporol: rolData?.tipo,
            };
          }),
        );

        return {
          ...observacion,
          observador: datosObservador,
          listaparticipantes: datosObservados.map((observado) => {
            delete observado.rolespersonasproyecto;
            return observado;
          }),
        };
      }),
    );

    return res.status(200).json(observacionesSubprocesoFormateados);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

observaciones.delete("/eliminar/:idobservacion", async (req, res) => {
  try {
    const { idobservacion } = req.params;
    await prisma.$transaction(async (tx) => {
      const idObservacion = parseInt(idobservacion);
      const observacion = await tx.observaciones.findUnique({
        where: {
          idobservacion: idObservacion,
        },
      });

      if (observacion.tipo === "Activa") {
        await tx.observacionesobservados.deleteMany({
          where: {
            idobservacion: idObservacion,
          },
        });
      }

      const observacionEliminada = await tx.observaciones.delete({
        where: {
          idobservacion: idObservacion,
        },
      });

      return res.status(200).json(observacionEliminada);
    });
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

observaciones.put("/editar/:idobservacion", async (req, res) => {
  try {
    const { idobservacion } = req.params;
    const {
      nombre,
      descripcion,
      idobservador,
      lugar,
      tipo,
      fechahoracaptura,
      listaparticipantes,
    } = req.body;
    const observacionEditar = fechahoracaptura
      ? {
          nombre,
          descripcion,
          idobservador,
          lugar,
          tipo,
          fechahoracaptura,
          listaparticipantes,
        }
      : {
          nombre,
          descripcion,
          idobservador,
          lugar,
          tipo,
          listaparticipantes,
        };
    const idObservacion = parseInt(idobservacion);

    await prisma.$transaction(async (tx) => {
      if (observacionEditar.tipo === "Activa") {
        await tx.observacionesobservados.deleteMany({
          where: {
            idobservacion: idObservacion,
          },
        });

        const arrayIds = observacionEditar.listaparticipantes.map(
          (observado) => {
            return {
              idobservacion: idObservacion,
              idobservado: observado.idpersona,
            };
          },
        );

        await tx.observacionesobservados.createMany({
          data: arrayIds,
        });
      }

      if (observacionEditar.tipo === "Pasiva") {
        await tx.observacionesobservados.deleteMany({
          where: {
            idobservacion: idObservacion,
          },
        });
      }

      const { listaparticipantes, ...observacionSinListaParticipantes } =
        observacionEditar;

      const observacionEditada = await tx.observaciones.update({
        data: observacionSinListaParticipantes,
        where: {
          idobservacion: idObservacion,
        },
      });

      const observador = await tx.personas.findUnique({
        where: {
          idpersona: observacionEditada.idobservador,
        },
      });

      const idsObservados = await tx.observacionesobservados.findMany({
        where: {
          idobservacion: idObservacion,
        },
        select: {
          idobservado: true,
        },
      });

      if (idsObservados.length > 0) {
        const arrayIdsObservados = idsObservados.map((o) => o.idobservado);

        const arrayDatosObservados = await Promise.all(
          arrayIdsObservados.map(async (id) => {
            const datosObservado = await tx.personas.findUnique({
              where: {
                idpersona: id,
              },
              include: {
                rolespersonasproyecto: {
                  include: {
                    roles: {
                      select: {
                        idrol: true,
                        nombre: true,
                        tipo: true,
                      },
                    },
                  },
                },
              },
            });

            // Igual el array de rolespersonasproyecto no debería de tener más de un elemento nunca
            // porque solo puede tener un rol por proyecto cada participante
            const datosObservacion = {
              ...datosObservado,
              idrolpersonaproyecto:
                datosObservado.rolespersonasproyecto[0].idrolpersonaproyecto,
              idrol: datosObservado.rolespersonasproyecto[0].roles.idrol,
              nombrerol: datosObservado.rolespersonasproyecto[0].roles.nombre,
              tiporol: datosObservado.rolespersonasproyecto[0].roles.tipo,
            };
            delete datosObservacion.rolespersonasproyecto;
            return datosObservacion;
          }),
        );

        return res.status(200).json({
          ...observacionEditada,
          observador,
          listaparticipantes: arrayDatosObservados,
        });
      }
      return res.status(200).json({
        ...observacionEditada,
        observador,
        listaparticipantes: [],
      });
    });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

export default observaciones;
