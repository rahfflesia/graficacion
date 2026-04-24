/*
  Warnings:

  - You are about to drop the `stakeholders` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[correo]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idproyecto` to the `procesos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "estadosproyectos" AS ENUM ('Activo', 'Pausado', 'Cancelado', 'En revisión');

-- CreateEnum
CREATE TYPE "tipoobservacion" AS ENUM ('Pasiva', 'Activa');

-- CreateEnum
CREATE TYPE "tipopregunta" AS ENUM ('Abierta', 'Opción múltiple', 'Escala');

-- DropForeignKey
ALTER TABLE "stakeholders" DROP CONSTRAINT "fk_stakeholders_proyecto";

-- AlterTable
ALTER TABLE "procesos" ADD COLUMN     "idproyecto" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "proyectos" ADD COLUMN     "estado" "estadosproyectos" NOT NULL DEFAULT 'Activo';

-- DropTable
DROP TABLE "stakeholders";

-- CreateTable
CREATE TABLE "observaciones" (
    "idobservacion" SERIAL NOT NULL,
    "idsubproceso" INTEGER NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "idobservador" INTEGER NOT NULL,
    "lugar" VARCHAR(255) NOT NULL,
    "tipo" "tipoobservacion" NOT NULL,
    "fechahoracaptura" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "observaciones_pkey" PRIMARY KEY ("idobservacion")
);

-- CreateTable
CREATE TABLE "observacionesobservados" (
    "idobservacion" INTEGER NOT NULL,
    "idobservado" INTEGER NOT NULL,

    CONSTRAINT "observacionesobservados_pkey" PRIMARY KEY ("idobservacion","idobservado")
);

-- CreateTable
CREATE TABLE "cuestionarios" (
    "idicuestionario" SERIAL NOT NULL,
    "idsubproceso" INTEGER NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "idcreador" INTEGER NOT NULL,
    "fechacreacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cuestionarios_pkey" PRIMARY KEY ("idicuestionario")
);

-- CreateTable
CREATE TABLE "preguntascuestionario" (
    "idpregunta" SERIAL NOT NULL,
    "idcuestionario" INTEGER NOT NULL,
    "textopregunta" TEXT NOT NULL,
    "tipopregunta" "tipopregunta" NOT NULL,
    "opciones" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "orden" INTEGER NOT NULL,

    CONSTRAINT "preguntascuestionario_pkey" PRIMARY KEY ("idpregunta")
);

-- CreateTable
CREATE TABLE "respuestascuestionario" (
    "idrespuesta" SERIAL NOT NULL,
    "idcuestionario" INTEGER NOT NULL,
    "idrespondente" INTEGER NOT NULL,
    "fecharespuesta" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "respuestascuestionario_pkey" PRIMARY KEY ("idrespuesta")
);

-- CreateTable
CREATE TABLE "respuestaspreguntas" (
    "idrespuestapregunta" SERIAL NOT NULL,
    "idrespuesta" INTEGER NOT NULL,
    "idpregunta" INTEGER NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "respuestaspreguntas_pkey" PRIMARY KEY ("idrespuestapregunta")
);

-- CreateIndex
CREATE UNIQUE INDEX "nombre_unico" ON "usuarios"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "correo_unico" ON "usuarios"("correo");

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "fk_proyecto_procesos" FOREIGN KEY ("idproyecto") REFERENCES "proyectos"("idproyecto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "observaciones" ADD CONSTRAINT "observaciones_idobservador_fkey" FOREIGN KEY ("idobservador") REFERENCES "personas"("idpersona") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "observaciones" ADD CONSTRAINT "observaciones_idsubproceso_fkey" FOREIGN KEY ("idsubproceso") REFERENCES "subprocesos"("idsubproceso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "observacionesobservados" ADD CONSTRAINT "observacionesobservados_idobservacion_fkey" FOREIGN KEY ("idobservacion") REFERENCES "observaciones"("idobservacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "observacionesobservados" ADD CONSTRAINT "observacionesobservados_idobservado_fkey" FOREIGN KEY ("idobservado") REFERENCES "personas"("idpersona") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cuestionarios" ADD CONSTRAINT "cuestionarios_idcreador_fkey" FOREIGN KEY ("idcreador") REFERENCES "personas"("idpersona") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cuestionarios" ADD CONSTRAINT "cuestionarios_idsubproceso_fkey" FOREIGN KEY ("idsubproceso") REFERENCES "subprocesos"("idsubproceso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "preguntascuestionario" ADD CONSTRAINT "preguntascuestionario_idcuestionario_fkey" FOREIGN KEY ("idcuestionario") REFERENCES "cuestionarios"("idicuestionario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "respuestascuestionario" ADD CONSTRAINT "respuestascuestionario_idcuestionario_fkey" FOREIGN KEY ("idcuestionario") REFERENCES "cuestionarios"("idicuestionario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "respuestascuestionario" ADD CONSTRAINT "respuestascuestionario_idrespondente_fkey" FOREIGN KEY ("idrespondente") REFERENCES "personas"("idpersona") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "respuestaspreguntas" ADD CONSTRAINT "respuestaspreguntas_idrespuesta_fkey" FOREIGN KEY ("idrespuesta") REFERENCES "respuestascuestionario"("idrespuesta") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "respuestaspreguntas" ADD CONSTRAINT "respuestaspreguntas_idpregunta_fkey" FOREIGN KEY ("idpregunta") REFERENCES "preguntascuestionario"("idpregunta") ON DELETE CASCADE ON UPDATE NO ACTION;
