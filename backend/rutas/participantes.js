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
    const camposFaltantes = validarCamposRequeridos(datosParticipante, [
      "nombre",
      "apellidoUno",
      "idrol",
      "idproyecto",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);

    const participanteFormateado = await prisma.$transaction(async (tx) => {
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
            idrol: Number(idrol),
            idproyecto: Number(idproyecto),
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
        idrol: detallesParticipanteRegistrado.idrol,
      };
      return datosParticipanteFormateados;
    });

    return res.status(201).json(participanteFormateado);
  } catch (error) {
    return enviarError(res, error, "Error al registrar el participante");
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
    const idparticipante = parseId(req.params.idparticipante);
    if (!idparticipante) return responderIdInvalido(res, "idparticipante");

    const datosParticipante = req.body;
    const camposFaltantes = validarCamposRequeridos(datosParticipante, [
      "nombre",
      "apellidouno",
      "idrol",
      "idrolpersonaproyecto",
    ]);
    if (camposFaltantes.length > 0) return responderCamposFaltantes(res, camposFaltantes);

    const participanteEditado = await prisma.$transaction(async (tx) => {
      const datosParticipanteEditados = await tx.personas.update({
        data: {
          nombre: datosParticipante.nombre,
          apellidouno: datosParticipante.apellidouno,
          apellidodos: datosParticipante.apellidodos,
          correo: datosParticipante.correo,
          telefono: datosParticipante.telefono,
        },
        where: {
          idpersona: idparticipante,
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
          idrol: true,
          idrolpersonaproyecto: true,
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
      return datosParticipanteEditadoFormateados;
    });

    return res.status(200).json(participanteEditado);
  } catch (error) {
    return enviarError(res, error, "Error al editar el participante");
  }
});

participantes.delete("/eliminar/:idrolpersonaproyecto", async (req, res) => {
  try {
    const idrolpersonaproyecto = parseId(req.params.idrolpersonaproyecto);
    if (!idrolpersonaproyecto) return responderIdInvalido(res, "idrolpersonaproyecto");

    // Acá retorno una interfaz diferente porque nomás ocupo el id para comparar y actualizar la interfaz de usuario en el frontend
    const participanteEliminado = await prisma.rolespersonasproyecto.delete({
      where: {
        idrolpersonaproyecto,
      },
    });
    return res.status(200).json(participanteEliminado);
  } catch (error) {
    return enviarError(res, error, "Error al eliminar el participante");
  }
});

export default participantes;
