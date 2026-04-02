import jwt from "jsonwebtoken";

export function validarToken(req, res, next) {
  const token = req.cookies["token"];

  if (!token)
    return res.status(403).json({ mensaje: "No se ha proporcionado un token" });

  jwt.verify(token, process.env.JWT_SECRET, function (error) {
    if (error) {
      console.error(error.message);
      return res
        .status(401)
        .json({ mensaje: "El token se encuentra expirado o es inválido" });
    }

    next();
  });
}
