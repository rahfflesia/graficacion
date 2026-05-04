import { prisma } from './db/db.js';

const tecnicas = [
  { nombre: 'Entrevista', descripcion: 'Recolección mediante entrevistas' },
  { nombre: 'Observacion', descripcion: 'Recolección mediante observación directa' },
  { nombre: 'Cuestionario', descripcion: 'Recolección mediante cuestionarios' },
  { nombre: 'Historia de usuario', descripcion: 'Recolección mediante historias de usuario' },
  { nombre: 'Focus group', descripcion: 'Recolección mediante grupos focales' },
  { nombre: 'Análisis de documento', descripcion: 'Recolección mediante análisis documental' },
];

for (const t of tecnicas) {
  const tecnicaExistente = await prisma.tecnicasrecoleccion.findFirst({
    where: {
      nombre: t.nombre,
    },
  });

  if (!tecnicaExistente) {
    await prisma.tecnicasrecoleccion.create({ data: t });
  }
}

console.log('Técnicas sincronizadas');
process.exit(0);
