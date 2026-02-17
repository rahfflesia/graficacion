-- CreateEnum
CREATE TYPE "tiporol" AS ENUM ('Interno', 'Externo');

-- CreateTable
CREATE TABLE "metodossubprocesos" (
    "idmetodosubproceso" SERIAL NOT NULL,
    "idsubproceso" INTEGER NOT NULL,
    "idtecnicarecopilacion" INTEGER NOT NULL,

    CONSTRAINT "metodossubprocesos_pkey" PRIMARY KEY ("idmetodosubproceso")
);

-- CreateTable
CREATE TABLE "procesos" (
    "idproceso" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "creador" VARCHAR(255) NOT NULL,

    CONSTRAINT "procesos_pkey" PRIMARY KEY ("idproceso")
);

-- CreateTable
CREATE TABLE "proyectos" (
    "idproyecto" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("idproyecto")
);

-- CreateTable
CREATE TABLE "roles" (
    "idrol" SERIAL NOT NULL,
    "idproyecto" INTEGER NOT NULL,
    "nombrerol" VARCHAR(255) NOT NULL,
    "tipo" "tiporol" NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("idrol")
);

-- CreateTable
CREATE TABLE "rolesusuario" (
    "idrolusuario" SERIAL NOT NULL,
    "nombrepersonaasignada" VARCHAR(255) NOT NULL,
    "idproyecto" INTEGER NOT NULL,
    "idrol" INTEGER NOT NULL,

    CONSTRAINT "rolesusuario_pkey" PRIMARY KEY ("idrolusuario")
);

-- CreateTable
CREATE TABLE "tecnicasrecoleccion" (
    "idtecnicarecoleccion" SERIAL NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "tecnicasrecoleccion_pkey" PRIMARY KEY ("idtecnicarecoleccion")
);
