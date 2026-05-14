const procesadoresDiagramas = {
  clase: procesarDiagramaClase,
  casos_uso: procesarDiagramaCasosUso,
  paquetes: procesarDiagramaPaquetes,
  secuencia: procesarDiagramaSecuencia,
};

function procesarDiagramaClase(diagramaClase) {
  if (!diagramaClase) {
    console.error("El diagrama de clase no está definido");
    return;
  }

  const nodos = diagramaClase.nodes;
  const aristas = diagramaClase.edges;

  let contenido = ``;

  const mapaNodos = new Map();

  for (const nodo of nodos) {
    mapaNodos.set(nodo.id, nodo);
  }

  for (const nodo of nodos) {
    const tipo = nodo.type;
    const datos = nodo.data;

    if (
      tipo !== "diagramaClase" &&
      tipo !== "diagramaInterfaz" &&
      tipo !== "diagramaEnum"
    )
      continue;

    switch (tipo) {
      case "diagramaClase":
        contenido += `Clase: ${datos.nombre}`;
        break;
      case "diagramaInterfaz":
        contenido += `Interfaz ${datos.nombre}`;
        break;
      case "diagramaEnum":
        contenido += `Enum ${datos.nombre}`;
        break;
    }

    if (datos.atributos.length > 0) {
      contenido += `\nAtributos\n`;

      for (const atributo of datos.atributos) {
        contenido += `${atributo}\n`;
      }
    }

    if (datos.metodos.length > 0) {
      contenido += `\nMétodos\n`;

      for (const metodo of datos.metodos) {
        contenido += `${metodo}\n`;
      }
    }

    const relaciones = aristas.filter(
      (arista) => arista.source === nodo.id || arista.target === nodo.id,
    );

    if (relaciones.length > 0) {
      contenido += `\nRelaciones:\n`;

      for (const relacion of relaciones) {
        const origen = mapaNodos.get(relacion.source);
        const destino = mapaNodos.get(relacion.target);

        if (!origen || !destino) continue;

        const nombreOrigen = origen.data.nombre;
        const nombreDestino = destino.data.nombre;

        const esOrigen = relacion.source === nodo.id;

        if (esOrigen) {
          contenido += `- ${nombreOrigen} -> ${nombreDestino}\n`;
        } else {
          contenido += `- ${nombreDestino} -> ${nombreOrigen}\n`;
        }
      }
    }

    contenido += "\n";
  }

  return contenido;
}

function procesarDiagramaCasosUso(diagramaCasosUso) {
  if (!diagramaCasosUso) {
    console.error("El diagrama de casos de uso no se encuentra definido");
    return;
  }

  const nodos = diagramaCasosUso.nodes;
  const aristas = diagramaCasosUso.edges;

  let contenido = `Diagrama de casos de uso\n\n`;

  const mapaNodos = new Map();

  for (const nodo of nodos) {
    mapaNodos.set(nodo.id, nodo);
  }

  const boundary = nodos.find((nodo) => nodo.type === "boundary");

  if (boundary) {
    contenido += `Sistema: ${boundary.data.nombreBoundary}\n\n`;
  }

  const actores = nodos.filter((nodo) => nodo.type === "actor");

  if (actores.length > 0) {
    contenido += `Actores:\n`;

    for (const actor of actores) {
      contenido += `- ${actor.data.textoActor}\n`;
    }

    contenido += "\n";
  }

  const casosUso = nodos.filter((nodo) => nodo.type === "casoUso");

  if (casosUso.length > 0) {
    contenido += `Casos de uso:\n`;

    for (const casoUso of casosUso) {
      contenido += `- ${casoUso.data.textoCasoUso}\n`;
    }

    contenido += "\n";
  }

  if (aristas.length > 0) {
    contenido += `Relaciones:\n`;

    for (const arista of aristas) {
      const origen = mapaNodos.get(arista.source);
      const destino = mapaNodos.get(arista.target);

      if (!origen || !destino) continue;

      const nombreOrigen =
        origen.type === "actor"
          ? origen.data.textoActor
          : origen.data.textoCasoUso;

      const nombreDestino =
        destino.type === "actor"
          ? destino.data.textoActor
          : destino.data.textoCasoUso;

      contenido += `- ${nombreOrigen} interactúa con ${nombreDestino}\n`;
    }
  }

  contenido += "\n";

  return contenido;
}

function procesarDiagramaPaquetes(diagramaPaquetes) {
  if (!diagramaPaquetes) {
    console.error("El diagrama de paquetes no se encuentra definido");
    return;
  }

  const nodos = diagramaPaquetes.nodes;
  const aristas = diagramaPaquetes.edges;

  let contenido = `Diagrama de paquetes\n\n`;

  const mapaNodos = new Map();

  for (const nodo of nodos) {
    mapaNodos.set(nodo.id, nodo);
  }

  const paquetes = nodos.filter(
    (nodo) => nodo.type === "paquete" || nodo.type === "paquete_v2",
  );

  if (paquetes.length > 0) {
    contenido += `Paquetes:\n`;

    for (const paquete of paquetes) {
      contenido += `- ${paquete.data.nombrePaquete}\n`;
    }

    contenido += "\n";
  }

  if (aristas.length > 0) {
    contenido += `Dependencias:\n`;

    for (const arista of aristas) {
      const origen = mapaNodos.get(arista.source);
      const destino = mapaNodos.get(arista.target);

      if (!origen || !destino) continue;

      const nombreOrigen = origen.data.nombrePaquete;
      const nombreDestino = destino.data.nombrePaquete;

      contenido += `- ${nombreOrigen} depende de ${nombreDestino}\n`;
    }

    contenido += "\n";
  }

  const paquetesPadre = paquetes.filter((paquete) => !paquete.groupId);

  if (paquetesPadre.length > 0) {
    contenido += `Jerarquía de paquetes:\n`;

    for (const padre of paquetesPadre) {
      const hijos = paquetes.filter((paquete) => paquete.groupId === padre.id);

      if (hijos.length === 0) continue;

      contenido += `\n${padre.data.nombrePaquete}\n`;

      for (const hijo of hijos) {
        contenido += `- ${hijo.data.nombrePaquete}\n`;
      }
    }
  }

  contenido += "\n";

  return contenido;
}

function procesarDiagramaSecuencia(diagramaSecuencia) {
  const nodos = diagramaSecuencia.nodes;
  const aristas = diagramaSecuencia.edges;

  const lifelines = new Map();

  for (const nodo of nodos) {
    if (nodo.type === "lineaVida" || nodo.type === "actorSecuencia") {
      lifelines.set(nodo.id, nodo.data.nombreParticipante);
    }
  }

  const activacionAParticipante = new Map();

  for (const nodo of nodos) {
    if (nodo.type === "activacion") {
      activacionAParticipante.set(nodo.id, lifelines.get(nodo.groupId));
    }
  }

  const aristasOrdenados = [...aristas].sort(
    (a, b) => a.points[0].y - b.points[0].y,
  );

  const lineas = aristasOrdenados.map((arista) => {
    const origen = activacionAParticipante.get(arista.source);
    const destino = activacionAParticipante.get(arista.target);

    return `${origen} -> ${destino}: ${arista.data.label}`;
  });

  return lineas.join("\n");
}

function generarArchivoDiagrama(tipo, diagrama) {
  const procesador = procesadoresDiagramas[tipo];

  if (!procesador) return "";

  return procesador(diagrama);
}

export { generarArchivoDiagrama };
