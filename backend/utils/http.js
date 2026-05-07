export function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function validarCamposRequeridos(datos, campos) {
  return campos.filter((campo) => {
    const valor = datos?.[campo];
    return valor === undefined || valor === null || valor === "";
  });
}

export function enviarError(res, error, mensaje = "Error interno del servidor") {
  console.error(error);

  if (error?.code === "P2025") {
    return res.status(404).json({ error: "No se encontró el recurso solicitado" });
  }

  if (error?.code === "P2002") {
    return res.status(409).json({ error: "Ya existe un registro con esos datos" });
  }

  if (error?.code === "P2003") {
    return res.status(409).json({ error: "El registro está relacionado con otros datos" });
  }

  return res.status(500).json({
    error: mensaje,
    detalle: error?.message,
  });
}

export function responderCamposFaltantes(res, campos) {
  return res.status(400).json({
    error: "Faltan campos requeridos",
    campos,
  });
}

export function responderIdInvalido(res, nombre = "id") {
  return res.status(400).json({
    error: `El parámetro ${nombre} no es válido`,
  });
}
