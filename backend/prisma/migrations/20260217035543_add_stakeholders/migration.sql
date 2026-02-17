-- CreateTable
CREATE TABLE "stakeholders" (
    "idstakeholder" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "influencia" VARCHAR(100) NOT NULL,
    "interes" VARCHAR(100) NOT NULL,
    "idproyecto" INTEGER NOT NULL,

    CONSTRAINT "stakeholders_pkey" PRIMARY KEY ("idstakeholder")
);
