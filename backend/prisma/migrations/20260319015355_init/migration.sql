-- CreateEnum
CREATE TYPE "tiporol" AS ENUM ('Interno', 'Externo');

-- CreateEnum
CREATE TYPE "tipousuario" AS ENUM ('Persona', 'Usuario');

-- CreateTable
CREATE TABLE "metodossubprocesos" (
    "idmetodosubproceso" SERIAL NOT NULL,
    "idsubproceso" INTEGER NOT NULL,
    "idtecnicarecoleccion" INTEGER NOT NULL,

    CONSTRAINT "metodossubprocesos_pkey" PRIMARY KEY ("idmetodosubproceso")
);

-- CreateTable
CREATE TABLE "procesos" (
    "idproceso" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechacreacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idproyecto" INTEGER NOT NULL,

    CONSTRAINT "procesos_pkey" PRIMARY KEY ("idproceso")
);

-- CreateTable
CREATE TABLE "proyectos" (
    "idproyecto" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechacreacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idusuario" INTEGER NOT NULL,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("idproyecto")
);

-- CreateTable
CREATE TABLE "roles" (
    "idrol" SERIAL NOT NULL,
    "idproyecto" INTEGER NOT NULL,
    "nombre" VARCHAR(255),
    "tipo" "tiporol" NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("idrol")
);

-- CreateTable
CREATE TABLE "tecnicasrecoleccion" (
    "idtecnicarecoleccion" SERIAL NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "tecnicasrecoleccion_pkey" PRIMARY KEY ("idtecnicarecoleccion")
);

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

-- CreateTable
CREATE TABLE "stakeholders" (
    "idstakeholder" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "influencia" VARCHAR(100) NOT NULL,
    "interes" VARCHAR(100) NOT NULL,
    "contacto" VARCHAR(255) NOT NULL,
    "fechacreacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idproyecto" INTEGER NOT NULL,

    CONSTRAINT "stakeholders_pkey" PRIMARY KEY ("idstakeholder")
);

-- CreateIndex
CREATE UNIQUE INDEX "rolespersonasproyecto_idpersona_idproyecto_key" ON "rolespersonasproyecto"("idpersona", "idproyecto");

-- CreateIndex
CREATE UNIQUE INDEX "nombre_unico" ON "usuarios"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "correo_unico" ON "usuarios"("correo");

-- AddForeignKey
ALTER TABLE "metodossubprocesos" ADD CONSTRAINT "fk_metodossubprocesos_subprocesos" FOREIGN KEY ("idsubproceso") REFERENCES "subprocesos"("idsubproceso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "metodossubprocesos" ADD CONSTRAINT "fk_metodossubprocesos_tecnicarsecoleccion" FOREIGN KEY ("idtecnicarecoleccion") REFERENCES "tecnicasrecoleccion"("idtecnicarecoleccion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "fk_proyecto_procesos" FOREIGN KEY ("idproyecto") REFERENCES "proyectos"("idproyecto") ON DELETE NO ACTION ON UPDATE NO ACTION;

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
ALTER TABLE "stakeholders" ADD CONSTRAINT "fk_stakeholders_proyectos" FOREIGN KEY ("idproyecto") REFERENCES "proyectos"("idproyecto") ON DELETE NO ACTION ON UPDATE NO ACTION;
