/*
  Warnings:

  - You are about to drop the column `idtecnicarecopilacion` on the `metodossubprocesos` table. All the data in the column will be lost.
  - You are about to drop the column `creador` on the `procesos` table. All the data in the column will be lost.
  - You are about to drop the column `nombrerol` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the `rolesusuario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idtecnicarecoleccion` to the `metodossubprocesos` table without a default value. This is not possible if the table is not empty.
  - Made the column `descripcion` on table `procesos` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `idusuario` to the `proyectos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contacto` to the `stakeholders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "tipousuario" AS ENUM ('Persona', 'Usuario');

-- AlterTable
ALTER TABLE "metodossubprocesos" DROP COLUMN "idtecnicarecopilacion",
ADD COLUMN     "idtecnicarecoleccion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "procesos" DROP COLUMN "creador",
ADD COLUMN     "fechacreacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "descripcion" SET NOT NULL;

-- AlterTable
ALTER TABLE "proyectos" ADD COLUMN     "fechacreacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "idusuario" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "nombrerol",
ADD COLUMN     "nombre" VARCHAR(255);

-- AlterTable
ALTER TABLE "stakeholders" ADD COLUMN     "contacto" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "rolesusuario";

-- CreateTable
CREATE TABLE "personas" (
    "idpersona" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "apellidouno" VARCHAR(255) NOT NULL,
    "apellidodos" VARCHAR(255),
    "correo" VARCHAR(255),
    "telefono" VARCHAR(255),

    CONSTRAINT "personas_pkey" PRIMARY KEY ("idpersona")
);

-- CreateTable
CREATE TABLE "rolespersonasproyecto" (
    "idrolpersonaproyecto" SERIAL NOT NULL,
    "idpersona" INTEGER NOT NULL,
    "idrol" INTEGER NOT NULL,
    "idproyecto" INTEGER NOT NULL,
    "tipo" "tipousuario" NOT NULL,

    CONSTRAINT "rolespersonasproyecto_pkey" PRIMARY KEY ("idrolpersonaproyecto")
);

-- CreateTable
CREATE TABLE "subprocesos" (
    "idsubproceso" SERIAL NOT NULL,
    "idproceso" INTEGER NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechacreacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subprocesos_pkey" PRIMARY KEY ("idsubproceso")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "idusuario" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "hashcontrasena" VARCHAR(255) NOT NULL,
    "fechacreacioncuenta" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correo" VARCHAR(255) NOT NULL,
    "pfp" VARCHAR(255) DEFAULT 'https://pbs.twimg.com/media/FeToVEqX0Acjv0i.png',

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("idusuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "rolespersonasproyecto_idpersona_idproyecto_key" ON "rolespersonasproyecto"("idpersona", "idproyecto");

-- AddForeignKey
ALTER TABLE "metodossubprocesos" ADD CONSTRAINT "fk_metodossubprocesos_subprocesos" FOREIGN KEY ("idsubproceso") REFERENCES "subprocesos"("idsubproceso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "metodossubprocesos" ADD CONSTRAINT "fk_metodossubprocesos_tecnicarsecoleccion" FOREIGN KEY ("idtecnicarecoleccion") REFERENCES "tecnicasrecoleccion"("idtecnicarecoleccion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "fk_proyectos_usuarios" FOREIGN KEY ("idusuario") REFERENCES "usuarios"("idusuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "fk_roles_proyecto" FOREIGN KEY ("idproyecto") REFERENCES "proyectos"("idproyecto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rolespersonasproyecto" ADD CONSTRAINT "fk_rolespersonasproyecto_persona" FOREIGN KEY ("idpersona") REFERENCES "personas"("idpersona") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rolespersonasproyecto" ADD CONSTRAINT "fk_rolespersonasproyecto_proyecto" FOREIGN KEY ("idproyecto") REFERENCES "proyectos"("idproyecto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rolespersonasproyecto" ADD CONSTRAINT "fk_rolespersonasproyecto_rol" FOREIGN KEY ("idrol") REFERENCES "roles"("idrol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subprocesos" ADD CONSTRAINT "fk_subprocesos_procesos" FOREIGN KEY ("idproceso") REFERENCES "procesos"("idproceso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stakeholders" ADD CONSTRAINT "fk_stakeholders_proyecto" FOREIGN KEY ("idproyecto") REFERENCES "proyectos"("idproyecto") ON DELETE NO ACTION ON UPDATE NO ACTION;
