-- CreateTable
CREATE TABLE "historiasusuario" (
    "idhistoriausuario" SERIAL NOT NULL,
    "idsubproceso" INTEGER NOT NULL,
    "idcreador" INTEGER NOT NULL,
    "rolusuario" VARCHAR(255) NOT NULL,
    "necesidad" TEXT NOT NULL,
    "beneficio" TEXT NOT NULL,
    "criteriosaceptacion" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "prioridad" VARCHAR(20) NOT NULL,
    "fechacreacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historiasusuario_pkey" PRIMARY KEY ("idhistoriausuario")
);

-- AddForeignKey
ALTER TABLE "historiasusuario" ADD CONSTRAINT "historiasusuario_idcreador_fkey" FOREIGN KEY ("idcreador") REFERENCES "personas"("idpersona") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historiasusuario" ADD CONSTRAINT "historiasusuario_idsubproceso_fkey" FOREIGN KEY ("idsubproceso") REFERENCES "subprocesos"("idsubproceso") ON DELETE NO ACTION ON UPDATE NO ACTION;
