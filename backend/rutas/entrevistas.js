import { prisma } from "../lib/prisma.ts";
import { Router } from "express";
import { validarToken } from "../middleware/authMiddleware.js";

const entrevistas = Router();

function formatearEntrevistados(arrayEntrevistados) {
  return arrayEntrevistados.flatMap((entrevistado) => {
    const entrevistadoFormateado = {
      idpersona: entrevistado.identrevistado,
      nombre: entrevistado.personas.nombre,
      apellidouno: entrevistado.personas.apellidouno,
      apellidodos: entrevistado.personas.apellidodos,
      correo: entrevistado.personas.correo,
      telefono: entrevistado.personas.telefono,
    };

    const roles = entrevistado.personas.rolespersonasproyecto.map(
      (datosRol) => {
        return {
          ...entrevistadoFormateado,
          nombrerol: datosRol.roles.nombre,
          idrol: datosRol.roles.idrol,
          idrolpersonaproyecto: datosRol.idrolpersonaproyecto,
          tiporol: datosRol.roles.tipo,
        };
      },
    );

    return roles;
  });
}

entrevistas.get("/obtener/:idsubproceso", async (req, res) => {
  try {
    const { idsubproceso } = req.params;
    const entrevistas = await prisma.entrevistas.findMany({
      where: {
        idsubproceso: parseInt(idsubproceso),
      },
      include: {
        entrevistadosentrevista: true,
        preguntasentrevista: true,
      },
    });

    const entrevistasFormateadas = await Promise.all(
      entrevistas.map(async (entrevista) => {
        const entrevistaAsociada = await prisma.entrevistas.findUnique({
          where: {
            identrevista: entrevista.identrevista,
          },
          include: {
            entrevistadosentrevista: {
              include: {
                personas: {
                  include: {
                    rolespersonasproyecto: {
                      include: {
                        roles: true,
                      },
                    },
                  },
                },
              },
            },
            preguntasentrevista: true,
          },
        });

        const datosEntrevistaFormateados = {
          idsubproceso: entrevistaAsociada.idsubproceso,
          identrevista: entrevistaAsociada.identrevista,
          nombre: entrevistaAsociada.nombre,
          descripcion: entrevistaAsociada.descripcion,
          identrevistador: entrevistaAsociada.identrevistador,
          fechahorainicio: entrevistaAsociada.fechahorainicio,
          fechahorafinalizacion: entrevistaAsociada.fechahorafinalizacion,
          lugar: entrevistaAsociada.lugar,
        };

        const arrayEntrevistadosFormateado = formatearEntrevistados(
          entrevistaAsociada.entrevistadosentrevista,
        );

        return {
          entrevista: datosEntrevistaFormateados,
          entrevistados: arrayEntrevistadosFormateado,
          preguntasentrevista: entrevistaAsociada.preguntasentrevista,
        };
      }),
    );

    return res.status(200).json(entrevistasFormateadas);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

entrevistas.post("/crear", async (req, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      const datos = req.body;
      const entrevista = await tx.entrevistas.create({
        data: {
          ...datos.entrevista,
          fechahorainicio: new Date(
            datos.entrevista.fechahorainicio,
          ).toISOString(),
          fechahorafinalizacion: new Date(
            datos.entrevista.fechahorafinalizacion,
          ).toISOString(),
        },
      });

      if (datos.entrevistados.length > 0) {
        const datosEntrevistadosFormateados = datos.entrevistados.map(
          (entrevistado) => {
            return {
              identrevistado: entrevistado.idpersona,
              identrevista: entrevista.identrevista,
            };
          },
        );
        await tx.entrevistadosentrevista.createMany({
          data: datosEntrevistadosFormateados,
        });
      }

      if (datos.preguntasentrevista.length > 0) {
        const preguntasFormateadas = datos.preguntasentrevista.map(
          (pregunta) => {
            return {
              ...pregunta,
              identrevista: entrevista.identrevista,
            };
          },
        );
        await tx.preguntasentrevista.createMany({
          data: preguntasFormateadas,
        });
      }

      const entrevistaCreada = await tx.entrevistas.findUnique({
        where: {
          identrevista: entrevista.identrevista,
        },
        include: {
          entrevistadosentrevista: {
            include: {
              personas: {
                include: {
                  rolespersonasproyecto: {
                    include: {
                      roles: true,
                    },
                  },
                },
              },
            },
          },
          preguntasentrevista: true,
        },
      });

      const arrayEntrevistadosFormateado = formatearEntrevistados(
        entrevistaCreada.entrevistadosentrevista,
      );

      const datosEntrevista = {
        idsubproceso: entrevistaCreada.idsubproceso,
        identrevista: entrevistaCreada.identrevista,
        nombre: entrevistaCreada.nombre,
        descripcion: entrevistaCreada.descripcion,
        identrevistador: entrevistaCreada.identrevistador,
        fechahorainicio: entrevistaCreada.fechahorainicio,
        fechahorafinalizacion: entrevistaCreada.fechahorafinalizacion,
        lugar: entrevistaCreada.lugar,
      };

      console.log(
        datosEntrevista.fechahorainicio,
        datosEntrevista.fechahorafinalizacion,
      );

      const entrevistaFormateada = {
        entrevista: datosEntrevista,
        entrevistados: arrayEntrevistadosFormateado,
        preguntasentrevista: entrevistaCreada.preguntasentrevista,
      };

      return res.status(201).json(entrevistaFormateada);
    });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

entrevistas.put("/editar/:identrevista", async (req, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      const { identrevista } = req.params;
      const id = parseInt(identrevista);
      const datos = req.body;

      if (datos.entrevistados.length < 1) {
        return res
          .status(400)
          .json({ error: "El array de entrevistados no puede estar vacío" });
      }

      if (datos.preguntasentrevista.length < 1) {
        return res
          .status(400)
          .json({ error: "El array de preguntas no puede estar vacío" });
      }

      await tx.entrevistas.update({
        where: {
          identrevista: id,
        },
        data: {
          ...datos.entrevista,
          fechahorainicio: new Date(
            datos.entrevista.fechahorainicio,
          ).toISOString(),
          fechahorafinalizacion: new Date(
            datos.entrevista.fechahorafinalizacion,
          ).toISOString(),
        },
      });

      const datosEntrevistadosFormateados = datos.entrevistados.map(
        (entrevistado) => {
          return {
            identrevistado: entrevistado.idpersona,
            identrevista: id,
          };
        },
      );

      await tx.entrevistadosentrevista.deleteMany({
        where: {
          identrevista: id,
        },
      });

      await tx.entrevistadosentrevista.createMany({
        data: datosEntrevistadosFormateados,
      });

      const preguntasFormateadas = datos.preguntasentrevista.map((pregunta) => {
        return {
          nombre: pregunta.nombre,
          descripcion: pregunta.descripcion,
          identrevista: id,
        };
      });

      await tx.preguntasentrevista.deleteMany({
        where: {
          identrevista: id,
        },
      });

      await tx.preguntasentrevista.createMany({
        data: preguntasFormateadas,
      });

      const entrevistaEditada = await tx.entrevistas.findUnique({
        where: {
          identrevista: id,
        },
        include: {
          entrevistadosentrevista: {
            include: {
              personas: {
                include: {
                  rolespersonasproyecto: {
                    include: {
                      roles: true,
                    },
                  },
                },
              },
            },
          },
          preguntasentrevista: true,
        },
      });

      const arrayEntrevistadosFormateado = formatearEntrevistados(
        entrevistaEditada.entrevistadosentrevista,
      );

      const entrevistaEditadaFormateada = {
        entrevista: {
          identrevista: entrevistaEditada.identrevista,
          idsubproceso: entrevistaEditada.idsubproceso,
          nombre: entrevistaEditada.nombre,
          descripcion: entrevistaEditada.descripcion,
          identrevistador: entrevistaEditada.identrevistador,
          fechahorainicio: entrevistaEditada.fechahorainicio,
          fechahorafinalizacion: entrevistaEditada.fechahorafinalizacion,
          lugar: entrevistaEditada.lugar,
        },
        entrevistados: arrayEntrevistadosFormateado,
        preguntasentrevista: entrevistaEditada.preguntasentrevista,
      };

      return res.status(200).json(entrevistaEditadaFormateada);
    });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

entrevistas.delete("/eliminar/:identrevista", async (req, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      const { identrevista } = req.params;
      const id = parseInt(identrevista);

      await tx.preguntasentrevista.deleteMany({
        where: {
          identrevista: id,
        },
      });

      await tx.entrevistadosentrevista.deleteMany({
        where: {
          identrevista: id,
        },
      });

      const entrevistaEliminada = await tx.entrevistas.delete({
        where: {
          identrevista: id,
        },
      });

      return res.status(200).json({ entrevista: entrevistaEliminada });
    });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

export default entrevistas;
