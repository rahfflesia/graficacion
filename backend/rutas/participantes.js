import { prisma } from "../lib/prisma.ts";
import { Router } from "express";
import { validarToken } from "../middleware/authMiddleware.js";

const participantes = Router();

participantes.use(validarToken);

/* Estos datos de acá los obtengo en el handler de proyectos para obtener todo en una sola petición*/
/* Quizás después lo utilizamos*/
/*participantes.get("/obtener/:idproyecto", async (req, res) => {
  try {
    const { idproyecto } = req.params;
    const participantes = await prisma.rolespersonasproyecto.findMany({
      where: {
        idproyecto: parseInt(idproyecto),
      },
      select: {
        personas: {
          select: {
            nombre: true,
            telefono: true,
            apellidouno: true,
            apellidodos: true,
            idpersona: true,
            correo: true,
          },
        },
        roles: {
          select: {
            nombre: true,
          },
        },
      },
    });
    const datosParticipantesFormateados = participantes.map(
      function (participante) {
        return {
          ...participante.personas,
          nombrerol: participante.roles.nombre,
        };
      },
    );
    return res.status(200).json(datosParticipantesFormateados);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});*/

participantes.post("/registrar", async (req, res) => {
  try {
    const datosParticipante = req.body;
    const { idrol, idproyecto } = datosParticipante;
    await prisma.$transaction(async (tx) => {
      const participanteRegistrado = await tx.personas.create({
        data: {
          nombre: datosParticipante.nombre,
          apellidouno: datosParticipante.apellidoUno,
          apellidodos: datosParticipante.apellidoDos,
          correo: datosParticipante.correo,
          telefono: datosParticipante.telefono,
        },
      });
      const detallesParticipanteRegistrado =
        await tx.rolespersonasproyecto.create({
          data: {
            idpersona: participanteRegistrado.idpersona,
            idrol: idrol,
            idproyecto: idproyecto,
            tipo: "Persona",
          },
          select: {
            roles: {
              select: {
                nombre: true,
              },
            },
            idrolpersonaproyecto: true,
            idrol: true,
          },
        });
      const datosParticipanteFormateados = {
        ...participanteRegistrado,
        nombrerol: detallesParticipanteRegistrado.roles.nombre,
        idrolpersonaproyecto:
          detallesParticipanteRegistrado.idrolpersonaproyecto,
      };
      return res.status(201).json(datosParticipanteFormateados);
    });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

/* 
nombre: string;
  apellidouno: string;
  apellidodos: string | null;
  correo: string;
  telefono: string;
  nombrerol: string;
  idpersona: number;
  idrol: number;
  idrolpersonaproyecto: number;
*/

participantes.put("/editar/:idparticipante", async (req, res) => {
  try {
    const { idparticipante } = req.params;
    const datosParticipante = req.body;
    await prisma.$transaction(async (tx) => {
      const datosParticipanteEditados = await tx.personas.update({
        data: {
          nombre: datosParticipante.nombre,
          apellidouno: datosParticipante.apellidouno,
          apellidodos: datosParticipante.apellidodos,
          correo: datosParticipante.correo,
          telefono: datosParticipante.telefono,
        },
        where: {
          idpersona: parseInt(idparticipante),
        },
      });
      const rolParticipanteEditado = await tx.rolespersonasproyecto.update({
        data: {
          idrol: parseInt(datosParticipante.idrol),
        },
        where: {
          idrolpersonaproyecto: parseInt(
            datosParticipante.idrolpersonaproyecto,
          ),
        },
        select: {
          roles: {
            select: {
              nombre: true,
            },
          },
        },
      });
      const datosParticipanteEditadoFormateados = {
        ...datosParticipanteEditados,
        idrol: rolParticipanteEditado.idrol,
        idrolpersonaproyecto: rolParticipanteEditado.idrolpersonaproyecto,
        nombrerol: rolParticipanteEditado.roles.nombre,
      };
      return res.status(200).json(datosParticipanteEditadoFormateados);
    });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

participantes.delete("/eliminar/:idrolpersonaproyecto", async (req, res) => {
  try {
    const { idrolpersonaproyecto } = req.params;
    // Acá retorno una interfaz diferente porque nomás ocupo el id para comparar y actualizar la interfaz de usuario en el frontend
    const participanteEliminado = await prisma.rolespersonasproyecto.delete({
      where: {
        idrolpersonaproyecto: parseInt(idrolpersonaproyecto),
      },
    });
    return res.status(200).json(participanteEliminado);
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

export default participantes;
