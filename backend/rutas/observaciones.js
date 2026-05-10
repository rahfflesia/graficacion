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

const observaciones = Router();

observaciones.use(validarToken);

async function formatearObservacion(observacion) {
  const idObservacion = observacion.idobservacion;

  const observadosRel = await prisma.observacionesobservados.findMany({
    where: { idobservacion: idObservacion },
    select: { idobservado: true },
  });

  const datosObservador = await prisma.personas.findUnique({
    where: { idpersona: observacion.idobservador },
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
        where: { idpersona: idObservado },
        include: { rolespersonasproyecto: true },
      });

      const rolPersona = participante.rolespersonasproyecto[0];

      if (!rolPersona) return participante;

      const rolData = await prisma.rolespersonasproyecto.findUnique({
        where: {
          idrolpersonaproyecto: rolPersona.idrolpersonaproyecto,
        },
        include: {
          roles: {
            select: { nombre: true },
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
    listaparticipantes: datosObservados.map((o) => {
      delete o.rolespersonasproyecto;
      return o;
    }),
  };
}

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
    const camposFaltantes = validarCamposRequeridos(req.body, [
      "nombre",
      "descripcion",
      "idobservador",
      "lugar",
      "listaobservados",
      "tipo",
      "idsubproceso",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);
    if (!["Activa", "Pasiva"].includes(tipo)) {
      return res.status(400).json({ error: "El tipo de observación no es válido" });
    }
    if (!Array.isArray(listaobservados)) {
      return res.status(400).json({ error: "listaobservados debe ser una lista" });
    }
    if (tipo === "Activa" && listaobservados.length < 1) {
      return res.status(400).json({ error: "La observación activa requiere observados" });
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const datosObservacion = fechahoracaptura
        ? {
            nombre,
            descripcion,
            idobservador: Number(idobservador),
            lugar,
            tipo,
            idsubproceso: Number(idsubproceso),
            fechahoracaptura,
          }
        : {
            nombre,
            descripcion,
            idobservador: Number(idobservador),
            lugar,
            tipo,
            idsubproceso: Number(idsubproceso),
          };

      const observacionCreada = await tx.observaciones.create({
        data: datosObservacion,
      });

      if (listaobservados.length > 0) {
        const arrayDatosObservados = listaobservados.map((o) => ({
          idobservacion: observacionCreada.idobservacion,
          idobservado: o.idpersona,
        }));

        await tx.observacionesobservados.createMany({
          data: arrayDatosObservados,
        });
      }

      return observacionCreada;
    });

    const observacionFormateada = await formatearObservacion(resultado);

    return res.status(201).json(observacionFormateada);
  } catch (error) {
    return enviarError(res, error, "Error al crear la observación");
  }
});

observaciones.get("/obtener/:idsubproceso", async (req, res) => {
  try {
    const idsubproceso = parseId(req.params.idsubproceso);
    if (!idsubproceso) return responderIdInvalido(res, "idsubproceso");

    const observacionesSubproceso = await prisma.observaciones.findMany({
      where: {
        idsubproceso,
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
    return enviarError(res, error, "Error al obtener observaciones");
  }
});

observaciones.delete("/eliminar/:idobservacion", async (req, res) => {
  try {
    const idObservacion = parseId(req.params.idobservacion);
    if (!idObservacion) return responderIdInvalido(res, "idobservacion");

    const observacionEliminada = await prisma.$transaction(async (tx) => {
      const observacion = await tx.observaciones.findUnique({
        where: {
          idobservacion: idObservacion,
        },
      });
      if (!observacion) throw { code: "P2025" };

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

      return observacionEliminada;
    });
    return res.status(200).json(observacionEliminada);
  } catch (error) {
    return enviarError(res, error, "Error al eliminar la observación");
  }
});

observaciones.put("/editar/:idobservacion", async (req, res) => {
  try {
    const idObservacion = parseId(req.params.idobservacion);
    if (!idObservacion) return responderIdInvalido(res, "idobservacion");

    const {
      nombre,
      descripcion,
      idobservador,
      lugar,
      tipo,
      fechahoracaptura,
      listaparticipantes,
    } = req.body;
    const camposFaltantes = validarCamposRequeridos(req.body, [
      "nombre",
      "descripcion",
      "idobservador",
      "lugar",
      "tipo",
      "listaparticipantes",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);
    if (!["Activa", "Pasiva"].includes(tipo)) {
      return res.status(400).json({ error: "El tipo de observación no es válido" });
    }
    if (!Array.isArray(listaparticipantes)) {
      return res.status(400).json({ error: "listaparticipantes debe ser una lista" });
    }
    if (tipo === "Activa" && listaparticipantes.length < 1) {
      return res.status(400).json({ error: "La observación activa requiere observados" });
    }

    const observacionEditar = fechahoracaptura
      ? {
          nombre,
          descripcion,
          idobservador: Number(idobservador),
          lugar,
          tipo,
          fechahoracaptura,
          listaparticipantes,
        }
      : {
          nombre,
          descripcion,
          idobservador: Number(idobservador),
          lugar,
          tipo,
          listaparticipantes,
        };
    const observacionEditadaFormateada = await prisma.$transaction(async (tx) => {
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

        return {
          ...observacionEditada,
          observador,
          listaparticipantes: arrayDatosObservados,
        };
      }
      return {
        ...observacionEditada,
        observador,
        listaparticipantes: [],
      };
    });
    return res.status(200).json(observacionEditadaFormateada);
  } catch (error) {
    return enviarError(res, error, "Error al editar la observación");
  }
});

export default observaciones;
