import Router from "express";
import { prisma } from "../lib/prisma.ts";

async function formatearSeguimiento(tx, seguimiento) {
  const idSeguimiento = seguimiento.idseguimiento;

  const involucradosRel = await tx.involucradosseguimiento.findMany({
    where: {
      idseguimiento: idSeguimiento,
    },
    select: {
      idpersona: true,
    },
  });

  const datosResponsable = await tx.personas.findUnique({
    where: {
      idpersona: seguimiento.idresponsable,
    },
    include: {
      rolespersonasproyecto: true,
    },
  });

  const idsInvolucrados = involucradosRel.map(
    (involucrado) => involucrado.idpersona,
  );

  if (idsInvolucrados.length === 0) {
    return {
      ...seguimiento,
      responsable: datosResponsable,
      involucrados: [],
    };
  }

  const datosInvolucrados = await Promise.all(
    idsInvolucrados.map(async (idPersona) => {
      const participante = await tx.personas.findUnique({
        where: {
          idpersona: idPersona,
        },
        include: {
          rolespersonasproyecto: true,
        },
      });

      const rolPersona = participante.rolespersonasproyecto[0];

      if (!rolPersona) return participante;

      const rolData = await tx.rolespersonasproyecto.findUnique({
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
    ...seguimiento,

    responsable: (() => {
      const copia = { ...datosResponsable };
      delete copia.rolespersonasproyecto;
      return copia;
    })(),

    involucradosseguimiento: datosInvolucrados.map((involucrado) => {
      delete involucrado.rolespersonasproyecto;
      return involucrado;
    }),
  };
}

const seguimientoTransaccional = Router();

seguimientoTransaccional.get("/obtener/:idsubproceso", async (req, res) => {
  try {
    const { idsubproceso } = req.params;

    const seguimientos = await prisma.seguimientotransaccional.findMany({
      where: {
        idsubproceso: Number(idsubproceso),
      },
    });

    const seguimientosFormateados = await Promise.all(
      seguimientos.map(async (seguimiento) =>
        formatearSeguimiento(prisma, seguimiento),
      ),
    );

    return res.status(200).json(seguimientosFormateados);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

seguimientoTransaccional.post("/crear", async (req, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      const datos = req.body;
      const copiaDatos = { ...datos };
      delete datos.involucradosseguimiento;

      const seguimientoCreado = await tx.seguimientotransaccional.create({
        data: datos,
        include: {
          involucradosseguimiento: true,
        },
      });

      const listaInvolucrados = copiaDatos.involucradosseguimiento.map(
        (involucrado) => ({
          idseguimiento: seguimientoCreado.idseguimiento,
          idpersona: involucrado.idpersona,
        }),
      );

      const involucradosSeguimiento =
        await tx.involucradosseguimiento.createMany({
          data: listaInvolucrados,
        });

      const seguimientoCreadoDatos =
        await tx.seguimientotransaccional.findUnique({
          where: {
            idseguimiento: seguimientoCreado.idseguimiento,
          },
        });

      const seguimientoCreadoFormateado = await formatearSeguimiento(
        tx,
        seguimientoCreadoDatos,
      );

      return res.status(201).json(seguimientoCreadoFormateado);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

seguimientoTransaccional.put("/editar", async (req, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      const datos = req.body;
      const copiaDatos = { ...datos };
      const idseguimiento = datos.idseguimiento;

      delete datos.involucradosseguimiento;
      delete datos.idseguimiento;

      await tx.seguimientotransaccional.update({
        where: {
          idseguimiento,
        },
        data: datos,
      });

      await tx.involucradosseguimiento.deleteMany({
        where: {
          idseguimiento,
        },
      });

      const listaInvolucrados = copiaDatos.involucradosseguimiento.map(
        (involucrado) => ({
          idseguimiento,
          idpersona: involucrado.idpersona,
        }),
      );

      if (listaInvolucrados.length > 0) {
        await tx.involucradosseguimiento.createMany({
          data: listaInvolucrados,
        });
      }

      const seguimientoActualizado =
        await tx.seguimientotransaccional.findUnique({
          where: {
            idseguimiento,
          },
        });

      const seguimientoFormateado = await formatearSeguimiento(
        tx,
        seguimientoActualizado,
      );

      return res.status(200).json(seguimientoFormateado);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

seguimientoTransaccional.delete(
  "/eliminar/:idseguimiento",
  async (req, res) => {
    const { idseguimiento } = req.params;
    try {
      await prisma.$transaction(async (tx) => {
        await tx.involucradosseguimiento.deleteMany({
          where: {
            idseguimiento: parseInt(idseguimiento),
          },
        });

        const seguimientoTransaccionalEliminado =
          await tx.seguimientotransaccional.delete({
            where: {
              idseguimiento: parseInt(idseguimiento),
            },
          });
        return res.status(200).json(seguimientoTransaccionalEliminado);
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  },
);

export default seguimientoTransaccional;
