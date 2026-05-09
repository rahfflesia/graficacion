DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'diagrama') THEN
    CREATE TYPE "diagrama" AS ENUM ('clase', 'secuencia', 'casos_uso', 'paquetes');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "diagramasproyectos" (
  "iddiagrama" SERIAL PRIMARY KEY,
  "idproyecto" INTEGER NOT NULL,
  "nombre" VARCHAR(255) NOT NULL,
  "tipo" "diagrama" NOT NULL,
  "contenido" JSONB NOT NULL,
  "fechacreacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ultimaedicion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "diagramasproyectos_idproyecto_fkey"
    FOREIGN KEY ("idproyecto")
    REFERENCES "proyectos"("idproyecto")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE UNIQUE INDEX IF NOT EXISTS "tipo_proyecto_unico"
  ON "diagramasproyectos"("idproyecto", "tipo");
