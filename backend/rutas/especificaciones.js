import Router from "express";
import { prisma } from "../lib/prisma.ts";
import { mkdir, writeFile } from "fs";
import generarArchivos from "../especificaciones/generacionEspecificaciones.js";
import { generarArchivoDiagrama } from "../especificaciones/procesarDiagramas.js";

function insertarDatos(arrayProcesos) {
  let contenido = "";

  for (let i = 0; i < arrayProcesos.length; i++) {
    const proceso = arrayProcesos[i];

    contenido += `PROCESO
ID: ${proceso.idproceso}
Nombre: ${proceso.nombre}
Descripción: ${proceso.descripcion}

`;

    if (proceso.subprocesos.length > 0) {
      contenido += `SUBPROCESOS ASOCIADOS AL PROCESO ${proceso.nombre} (ID: ${proceso.idproceso})

`;

      for (let j = 0; j < proceso.subprocesos.length; j++) {
        const subproceso = proceso.subprocesos[j];

        contenido += `ID: ${subproceso.idsubproceso}
Nombre: ${subproceso.nombre}
Descripción: ${subproceso.descripcion}

`;

        if (subproceso.entrevistas.length > 0)
          contenido += insertarDatosEntrevistas(subproceso);

        if (subproceso.observaciones.length > 0)
          contenido += insertarDatosObservaciones(subproceso);

        if (subproceso.cuestionarios.length > 0)
          contenido += insertarDatosCuestionarios(subproceso);

        if (subproceso.historiasusuario.length > 0)
          contenido += insertarHistoriasDeUsuario(subproceso);
      }
    }

    contenido += "\n";
  }

  return contenido;
}

function insertarDatosEntrevistas(subproceso) {
  let contenido = `ENTREVISTAS ASOCIADAS AL SUBPROCESO ${subproceso.nombre} (ID: ${subproceso.idsubproceso})

`;

  for (let i = 0; i < subproceso.entrevistas.length; i++) {
    const entrevista = subproceso.entrevistas[i];

    contenido += `NOMBRE DE LA ENTREVISTA: ${entrevista.nombre}
DESCRIPCIÓN: ${entrevista.descripcion}

`;

    if (entrevista.preguntasentrevista.length > 0) {
      contenido += `PREGUNTAS ASOCIADAS A LA ENTREVISTA ${entrevista.nombre} (ID: ${entrevista.identrevista})

`;

      for (let j = 0; j < entrevista.preguntasentrevista.length; j++) {
        const pregunta = entrevista.preguntasentrevista[j];

        contenido += `ID: ${pregunta.idpregunta}
Nombre: ${pregunta.nombre}
Respuesta: ${pregunta.descripcion}

`;
      }
    }
  }

  return contenido;
}

function insertarDatosObservaciones(subproceso) {
  let contenido = `OBSERVACIONES ASOCIADAS AL SUBPROCESO ${subproceso.nombre} (ID: ${subproceso.idsubproceso})

`;

  for (let i = 0; i < subproceso.entrevistas.length; i++) {
    const observacion = subproceso.observaciones[i];

    contenido += `NOMBRE DE LA OBSERVACION: ${observacion.nombre}
DESCRIPCIÓN: ${observacion.descripcion}

`;
  }

  return contenido;
}

function insertarDatosCuestionarios(subproceso) {
  let contenido = `CUESTIONARIOS ASOCIADOS AL SUBPROCESO ${subproceso.nombre} (ID: ${subproceso.idsubproceso})

`;

  for (let i = 0; i < subproceso.cuestionarios.length; i++) {
    const cuestionario = subproceso.cuestionarios[i];

    contenido += `NOMBRE DEL CUESTIONARIO: ${cuestionario.nombre} (ID: ${cuestionario.idicuestionario})
DESCRIPCIÓN: ${cuestionario.descripcion}

`;

    if (cuestionario.preguntascuestionario.length > 0) {
      contenido += `PREGUNTAS ASOCIADAS AL CUESTIONARIO ${cuestionario.nombre} (ID: ${cuestionario.idicuestionario})

`;

      for (let j = 0; j < cuestionario.preguntascuestionario.length; j++) {
        const pregunta = cuestionario.preguntascuestionario[j];

        contenido += `ID: ${pregunta.idpregunta}
Nombre de la pregunta del cuestionario: ${pregunta.textopregunta}
Tipo de pregunta: ${pregunta.tipopregunta} ${pregunta.tipopregunta === "Escala" ? "(1-5)" : ""}
`;
        contenido += insertarRespuestaPreguntaCuestionario(pregunta);
      }
    }
  }

  return contenido;
}

function insertarRespuestaPreguntaCuestionario(preguntaCuestionario) {
  let contenido = "";
  for (let i = 0; i < preguntaCuestionario.respuestaspreguntas.length; i++) {
    contenido += `Respuesta: ${preguntaCuestionario.respuestaspreguntas[i].valor}
`;
  }
  return contenido;
}

function insertarHistoriasDeUsuario(subproceso) {
  let contenido = `HISTORIAS DE USUARIO ASOCIADAS AL SUBPROCESO ${subproceso.nombre} (ID: ${subproceso.idsubproceso})
`;
  for (let i = 0; i < subproceso.historiasusuario.length; i++) {
    const historiaUsuario = subproceso.historiasusuario[i];
    contenido += `ID Historia de usuario: ${historiaUsuario.idhistoriausuario}
Rol de la persona que solicitó la historia de usuario: ${historiaUsuario.rolusuario}
Necesidad que cubre la historia de usuario: ${historiaUsuario.necesidad}
Beneficios que se obtienen de la historia de usuario: ${historiaUsuario.beneficio}
Criterios de aceptación:
`;
    for (let j = 0; j < historiaUsuario.criteriosaceptacion.length; j++) {
      contenido += `${historiaUsuario.criteriosaceptacion[j]}
`;
    }
  }
  return contenido;
}

// De focus group y análisis de documentos están implementadas las tablas pero no hay interfaz en el frontend
function insertarAnalisisDeDocumentos(subproceso) {}

function insertarFocusGroups(subproceso) {}

// De seguimiento transaccional no hay ni frontend ni tabla en la base de datos
function insertarSeguimientoTransaccional(subproceso) {}

const especificaciones = Router();

especificaciones.get("/obtener/:idproyecto", async (req, res) => {
  try {
    const { idproyecto } = req.params;
    const idProyectoInt = parseInt(idproyecto);

    const proyecto = await prisma.proyectos.findUnique({
      where: {
        idproyecto: idProyectoInt,
      },
    });

    const procesos = await prisma.procesos.findMany({
      where: {
        idproyecto: idProyectoInt,
      },
      include: {
        subprocesos: {
          include: {
            entrevistas: {
              include: {
                preguntasentrevista: true,
              },
            },
            observaciones: true,
            cuestionarios: {
              include: {
                preguntascuestionario: {
                  include: {
                    respuestaspreguntas: true,
                  },
                },
              },
            },
            historiasusuario: true,
            focusgroups: true,
            analisisDocumentos: true,
          },
        },
      },
    });

    const diagramas = await prisma.diagramasproyectos.findMany({
      where: {
        idproyecto: idProyectoInt,
      },
    });

    // Condicional para asegurarme de que el proyecto cuenta con todos los datos necesarios
    /*if (
      !procesos ||
      !proyecto ||
      procesos.length < 1 ||
      !diagramas ||
      diagramas.length < 1
    ) {
      return res.status(401).json({
        error:
          "El proyecto no cuenta con datos suficientes para generar las especificaciones",
      });
    }*/

    let contenido = `PROYECTO: ${proyecto.nombre}

DESCRIPCIÓN: ${proyecto.descripcion}

`;
    contenido += insertarDatos(procesos);

    writeFile("datos_generales.txt", contenido, "utf-8", (err) => {
      if (err) {
        console.error(
          "Ha ocurrido un error al crear el archivo de datos generales",
        );
        throw err;
      }
    });

    let contenidoArchivoDiagramas = `DIAGRAMAS DEL PROYECTO ${proyecto.nombre}
`;

    for (let i = 0; i < diagramas.length; i++) {
      const diagrama = diagramas[i];
      contenidoArchivoDiagramas += `Nombre del diagrama: ${diagrama.nombre}
Tipo de diagrama:  ${diagrama.tipo}

`;
      contenidoArchivoDiagramas += generarArchivoDiagrama(
        diagrama.tipo,
        JSON.parse(diagrama.contenido),
      );

      if (diagrama.tipo === "casos_uso") console.log(diagrama.contenido);
    }

    writeFile("diagramas.txt", contenidoArchivoDiagramas, "utf-8", (err) => {
      if (err) {
        console.error("Ha ocurrido un error al crear el archivo de diagramas");
        throw err;
      }
    });

    await generarArchivos();

    return res
      .status(200)
      .json({ mensaje: "Archivos generados correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

export default especificaciones;
