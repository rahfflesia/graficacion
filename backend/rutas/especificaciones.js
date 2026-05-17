import Router from "express";
import { prisma } from "../lib/prisma.ts";
import generarArchivos from "../especificaciones/generacionEspecificaciones.js";
import { generarArchivoDiagrama } from "../especificaciones/procesarDiagramas.js";
import fs from "node:fs/promises";
import path from "node:path";

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

        if (subproceso.analisisDocumentos.length > 0)
          contenido += insertarAnalisisDeDocumentos(subproceso);

        if (subproceso.focusgroups.length > 0)
          contenido += insertarFocusGroups(subproceso);

        if (subproceso.seguimientotransaccional.length > 0)
          contenido += insertarSeguimientosTransaccionales(subproceso);
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

  for (let i = 0; i < subproceso.observaciones.length; i++) {
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

function insertarAnalisisDeDocumentos(subproceso) {
  let contenido = `ANÁLISIS DE DOCUMENTOS ASOCIADOS AL SUBPROCESO ${subproceso.nombre} (ID: ${subproceso.idsubproceso})
`;
  for (let i = 0; i < subproceso.analisisDocumentos.length; i++) {
    const analisisDocumento = subproceso.analisisDocumentos[i];
    contenido += `Nombre: ${analisisDocumento.nombre}
Descripcion: ${analisisDocumento.descripcion}
Tipo de documento: ${analisisDocumento.tipodocumento}
Fuente: ${analisisDocumento.fuente}
Notas adicionales: ${analisisDocumento.notas}
`;
  }
  return contenido;
}

function insertarFocusGroups(subproceso) {
  let contenido = `FOCUS GROUPS ASOCIADOS AL SUBPROCESO ${subproceso.nombre} (ID: ${subproceso.idsubproceso})
`;
  for (let i = 0; i < subproceso.focusgroups.length; i++) {
    const focusGroup = subproceso.focusgroups[i];
    contenido += `Nombre: ${focusGroup.nombre}
Descripcion: ${focusGroup.descripcion}
Realizado en: ${focusGroup.lugar}
`;
  }
  return contenido;
}

function insertarSeguimientosTransaccionales(subproceso) {
  let contenido = `SEGUIMIENTOS TRANSACCIONALES ASOCIADOS AL SUBPROCESO ${subproceso.nombre} (ID: ${subproceso.idsubproceso})
`;
  for (let i = 0; i < subproceso.seguimientotransaccional.length; i++) {
    const seguimientoTransaccional = subproceso.seguimientotransaccional[i];
    contenido += `Nombre: ${seguimientoTransaccional.nombre}
Descripcion: ${seguimientoTransaccional.descripcion}
Tipo de transacción: ${seguimientoTransaccional.tipotransaccion}
Resultado esperado: ${seguimientoTransaccional.resultadoesperado}
Resultado obtenido: ${seguimientoTransaccional.resultadoobtenido}
`;
  }
  return contenido;
}

async function existeCarpeta(ruta) {
  try {
    const stats = await fs.stat(ruta);
    return stats.isDirectory();
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

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
            seguimientotransaccional: true,
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
    let valido = true;
    procesos.forEach((proceso) => {
      if (!proceso.subprocesos || proceso.subprocesos.length < 1)
        valido = false;
      proceso.subprocesos.forEach((subproceso) => {
        if (
          subproceso.analisisDocumentos.length < 1 &&
          subproceso.cuestionarios.length < 1 &&
          subproceso.entrevistas.length < 1 &&
          subproceso.observaciones.length < 1 &&
          subproceso.focusgroups.length < 1 &&
          subproceso.historiasusuario.length < 1 &&
          subproceso.seguimientotransaccional.length < 1
        ) {
          valido = false;
        }
      });
    });

    if (!proyecto) {
      return res.status(404).json({
        mensaje: "El proyecto no existe",
      });
    }

    if (procesos.length < 1) {
      return res.status(422).json({
        mensaje: "El proyecto debe de tener al menos un proceso",
      });
    }

    if (diagramas.length < 4) {
      return res.status(422).json({
        mensaje: "El proyecto debe contar con todos los diagramas",
      });
    }

    if (!valido) {
      return res.status(422).json({
        mensaje:
          "Cada proceso debe de contar con al menos un subproceso y cada subproceso debe de estar asociado a al menos una técnica de recolección",
      });
    }

    const nombreCarpeta = proyecto.nombre;
    const rutaCarpetaEspecificaciones = `C:/Users/chech/Downloads/${nombreCarpeta}`;
    if (await existeCarpeta(rutaCarpetaEspecificaciones)) {
      return res.status(409).json({
        mensaje: "Las especificaciones de este proyecto ya han sido generadas",
      });
    }

    await fs.mkdir(rutaCarpetaEspecificaciones);

    let contenido = `PROYECTO: ${proyecto.nombre}

DESCRIPCIÓN: ${proyecto.descripcion}

`;
    contenido += insertarDatos(procesos);

    await fs.writeFile(
      `${rutaCarpetaEspecificaciones}/datos_generales.txt`,
      contenido,
    );

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
    }

    await fs.writeFile(
      `${rutaCarpetaEspecificaciones}/diagramas.txt`,
      contenidoArchivoDiagramas,
    );
    await generarArchivos(rutaCarpetaEspecificaciones);

    return res
      .status(200)
      .json({ mensaje: "Archivos generados correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

export default especificaciones;
